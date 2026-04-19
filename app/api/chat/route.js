import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

import { createCacheKey, getCachedJSON, setCachedJSON } from "@/app/lib/redisCache";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const input = body.message;
    const normalizedInput = typeof input === "string" ? input.trim() : "";
    const cacheKey = createCacheKey(
      "chat",
      createHash("sha256").update(normalizedInput).digest("hex")
    );

    const cachedData = await getCachedJSON(cacheKey);

    if (cachedData !== null) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
        },
      });
    }

    const response = await getResponse(input);
    await setCachedJSON(cacheKey, { response });
    return NextResponse.json(
      { response: response },
      {
        headers: {
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

async function getResponse(input) {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": input
      }
    ],
    "model": "openai/gpt-oss-20b",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  });
  var response = ""
  for await (const chunk of chatCompletion) {
    response += chunk.choices[0]?.delta?.content || "";
  }

  return response;
}
