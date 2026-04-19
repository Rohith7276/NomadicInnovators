import { collection, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

import { fireDB } from "@/app/firebase/firebaseConfig"
import { createCacheKey, getCachedJSON, setCachedJSON } from "@/app/lib/redisCache"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req) {
  try {
    const cacheKey = createCacheKey("state", "list")
    const cachedData = await getCachedJSON(cacheKey)

    if (cachedData !== null) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
        },
      })
    }

    const colRef = collection(fireDB, "jsonData")
    const snapshot = await getDocs(colRef)

    if (snapshot.empty) {
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }

    const data = snapshot.docs[0].data()

    await setCachedJSON(cacheKey, data)

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
      },
    })

  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}