import redis from "../lib/redis";

export const isGloballyRateLimited = async (
  ip: string,
  limit = 10,
  windowSeconds = 60
): Promise<boolean> => {
  const key = `rate:global:${ip}`;

  // Get current count first
  const currentCountStr = await redis.get(key);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;

  if (currentCount >= limit) {
    // Already rate limited, don’t increment further
    return true;
  }

  // Use multi to increment and set expire atomically
  const tx = redis.multi();
  tx.incr(key);
  tx.expire(key, windowSeconds);
  await tx.exec();

  return false; // Not rate limited yet
};