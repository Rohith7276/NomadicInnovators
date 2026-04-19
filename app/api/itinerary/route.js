import Groq from "groq-sdk"
import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"

import { fireDB } from "@/app/firebase/firebaseConfig"
import { createCacheKey, getCachedJSON, setCachedJSON } from "@/app/lib/redisCache"

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY })

export const runtime = "nodejs"

function normalizeValue(value) {
  return String(value || "").trim()
}

function normalizeDestination(value) {
  return normalizeValue(value).toLowerCase().replace(/\s+/g, " ")
}

function toSlug(value) {
  return normalizeDestination(value).replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
}

function parseInterests(interests) {
  if (Array.isArray(interests)) {
    return interests.map((item) => normalizeValue(item)).filter(Boolean)
  }

  return normalizeValue(interests)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildCuratedContext(stateData, listingData) {
  const places = Array.isArray(stateData?.placesToVisit)
    ? stateData.placesToVisit.slice(0, 12).map((place) => ({
        placeName: normalizeValue(place?.placeName),
        description: normalizeValue(place?.desc),
      }))
    : []

  const culture = Array.isArray(stateData?.culture)
    ? stateData.culture.slice(0, 8).map((entry) => ({
        name: normalizeValue(entry?.cultureName),
        description: normalizeValue(entry?.cultureDesc),
      }))
    : []

  const packages = [
    ...(Array.isArray(stateData?.hotel) ? stateData.hotel : []),
    ...(Array.isArray(stateData?.hotels) ? stateData.hotels : []),
    ...(Array.isArray(listingData?.IndiaPackages) ? listingData.IndiaPackages : []),
  ]
    .slice(0, 12)
    .map((pkg) => ({
      name: normalizeValue(pkg?.name || pkg?.placeName),
      details: normalizeValue(pkg?.days || pkg?.desc),
    }))

  const listingState = Array.isArray(listingData?.states)
    ? listingData.states.find(
        (entry) => normalizeDestination(entry?.state) === normalizeDestination(stateData?.state)
      )
    : null

  return {
    destination: normalizeValue(stateData?.state),
    stateId: normalizeValue(stateData?.id),
    destinationDescription: normalizeValue(stateData?.desc || listingState?.description),
    places,
    culture,
    packages,
  }
}

function buildRelatedLinks(destinationInput, curatedContext, listingData) {
  const links = []

  if (curatedContext?.stateId) {
    links.push({
      label: `${curatedContext.destination} state page`,
      href: `/States/${curatedContext.stateId}`,
      type: "state",
    })
  }

  const destination = normalizeDestination(destinationInput)
  const packagePool = [
    ...(Array.isArray(curatedContext?.packages) ? curatedContext.packages : []),
    ...(Array.isArray(listingData?.IndiaPackages)
      ? listingData.IndiaPackages.map((pkg) => ({
          name: normalizeValue(pkg?.placeName || pkg?.name),
          details: normalizeValue(pkg?.desc || pkg?.days),
          link: normalizeValue(pkg?.hotel),
        }))
      : []),
  ]

  for (const pkg of packagePool) {
    const name = normalizeDestination(pkg?.name)
    const details = normalizeDestination(pkg?.details)
    const link = normalizeValue(pkg?.link)
    if (!link) continue

    if (name.includes(destination) || details.includes(destination)) {
      links.push({
        label: `${pkg.name || "Related package"} booking`,
        href: link,
        type: "package",
      })
    }
  }

  const unique = []
  const seen = new Set()

  for (const link of links) {
    const key = `${link.href}:${link.label}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(link)
    }
  }

  return unique.slice(0, 6)
}

async function findDestinationData(destinationInput) {
  const destination = normalizeDestination(destinationInput)

  if (!destination) {
    return { curatedContext: null, relatedLinks: [] }
  }

  const stateCollection = collection(fireDB, "state")

  const candidateDocIds = [
    destination,
    destination.replace(/\s+/g, ""),
    destination.replace(/\s+/g, "_"),
    toSlug(destination),
  ]

  let matchedStateDoc = null

  for (const docId of candidateDocIds) {
    const snapshot = await getDoc(doc(stateCollection, docId))
    if (snapshot.exists()) {
      matchedStateDoc = { id: snapshot.id, ...snapshot.data() }
      break
    }
  }

  let listingData = null

  if (!matchedStateDoc) {
    const stateSnapshot = await getDocs(stateCollection)

    const candidate = stateSnapshot.docs.find((record) => {
      const stateName = normalizeDestination(record.data()?.state)
      return stateName === destination
    })

    if (candidate) {
      matchedStateDoc = { id: candidate.id, ...candidate.data() }
    }
  }

  const listingSnapshot = await getDocs(collection(fireDB, "jsonData"))
  listingData = listingSnapshot.empty ? null : listingSnapshot.docs[0].data()

  if (!matchedStateDoc && listingData?.states?.length) {
    const matchedListingState = listingData.states.find(
      (entry) => normalizeDestination(entry?.state) === destination
    )

    if (matchedListingState) {
      matchedStateDoc = {
        state: matchedListingState.state,
        desc: matchedListingState.description,
        placesToVisit: [],
        culture: [],
        hotel: [],
        hotels: [],
      }
    }
  }

  if (!matchedStateDoc) {
    const fallbackContext = {
      destination: normalizeValue(destinationInput),
      stateId: "",
      destinationDescription: "",
      places: [],
      culture: [],
      packages: [],
    }

    return {
      curatedContext: fallbackContext,
      relatedLinks: buildRelatedLinks(destinationInput, fallbackContext, listingData),
    }
  }

  const curatedContext = buildCuratedContext(matchedStateDoc, listingData)
  return {
    curatedContext,
    relatedLinks: buildRelatedLinks(destinationInput, curatedContext, listingData),
  }
}

function buildPrompt({ destination, days, budget, interests, travelStyle, curatedContext }) {
  const prompt = `You are an expert travel planner for India.

Create a detailed travel itinerary based on the following user input:

Destination: ${destination}
Number of days: ${days}
Budget: ${budget}
Interests: ${interests.join(", ")} (e.g., beaches, temples, food, nightlife, adventure)
Travel style: ${travelStyle}

Requirements:
1. Generate a day-wise itinerary (Day 1, Day 2, etc.)
2. For each day include:
   - Places to visit (in logical order based on distance)
   - Short reason why each place is recommended
   - Estimated time to spend at each place
3. Include approximate daily cost breakdown:
   - Food
   - Transport
   - Entry fees
4. Suggest best time to visit each place (morning/evening)
5. Minimize travel time between locations
6. Keep total trip within budget

Output format:
- Clear structured text
- Use bullet points
- Keep it practical and realistic (no unnecessary fluff)

Data usage rule:
- Prefer curated destination data provided below whenever available.
- You may also use reliable general travel knowledge for India to fill practical gaps.
- If curated details are missing, clearly state: "Not available in site curated data" where relevant.

Curated destination data (from DB):
${JSON.stringify(curatedContext, null, 2)}`

  return prompt
}

async function generateItinerary(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
    temperature: 0.4,
    max_tokens: 1400,
    top_p: 1,
    stream: true,
    stop: null,
  })

  let response = ""

  for await (const chunk of completion) {
    response += chunk.choices[0]?.delta?.content || ""
  }

  return response
}

export async function POST(req) {
  try {
    const body = await req.json()

    const destination = normalizeValue(body.destination)
    const days = Number(body.days)
    const budget = Number(body.budget)
    const interests = parseInterests(body.interests)
    const travelStyle = normalizeValue(body.travelStyle || "budget")

    if (!destination || !days || days < 1 || !budget || budget < 1) {
      return NextResponse.json(
        { error: "Destination, days, and budget are required with valid values." },
        { status: 400 }
      )
    }

    const { curatedContext, relatedLinks } = await findDestinationData(destination)

    const cacheKey = createCacheKey(
      "itinerary",
      createHash("sha256")
        .update(
          JSON.stringify({
            destination: normalizeDestination(destination),
            days,
            budget,
            interests,
            travelStyle,
            curatedContext: curatedContext || {},
          })
        )
        .digest("hex")
    )

    const cachedData = await getCachedJSON(cacheKey)

    if (cachedData !== null) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
        },
      })
    }

    const prompt = buildPrompt({
      destination,
      days,
      budget,
      interests,
      travelStyle,
      curatedContext,
    })

    const response = await generateItinerary(prompt)

    const payload = {
      response,
      source: {
        destination: curatedContext?.destination || destination,
        curated: Boolean(curatedContext?.places?.length || curatedContext?.culture?.length),
      },
      relatedLinks,
    }

    await setCachedJSON(cacheKey, payload)

    return NextResponse.json(payload, {
      headers: {
        "X-Cache": "MISS",
      },
    })
  } catch (error) {
    console.error("Itinerary generation failed:", error)
    return NextResponse.json(
      { error: "Unable to generate itinerary at the moment." },
      { status: 500 }
    )
  }
}
