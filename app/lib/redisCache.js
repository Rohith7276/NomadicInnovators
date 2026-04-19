const DEFAULT_TTL_SECONDS = 300

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

function isRedisConfigured() {
  return Boolean(redisUrl && redisToken)
}

async function runRedisCommand(command) {
  if (!isRedisConfigured()) {
    return null
  }

  try {
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    })

    if (!response.ok) {
      console.warn(`Redis request failed with status ${response.status}`)
      return null
    }

    const payload = await response.json()

    if (payload?.error) {
      console.warn(`Redis error: ${payload.error}`)
      return null
    }

    return payload?.result ?? null
  } catch (error) {
    console.warn("Redis request failed", error)
    return null
  }
}

export function createCacheKey(...parts) {
  return parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .join(":")
}

export async function getCachedJSON(cacheKey) {
  const cachedValue = await runRedisCommand(["GET", cacheKey])

  if (typeof cachedValue !== "string") {
    return null
  }

  try {
    return JSON.parse(cachedValue)
  } catch {
    return null
  }
}

export async function setCachedJSON(cacheKey, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  return runRedisCommand(["SET", cacheKey, JSON.stringify(value), "EX", ttlSeconds])
}

export async function deleteCachedKey(cacheKey) {
  return runRedisCommand(["DEL", cacheKey])
}

export { DEFAULT_TTL_SECONDS }