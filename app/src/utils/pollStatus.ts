import redis from "../lib/redis";
import { prisma } from "../lib/prisma";

export const isPollActive = async (pollId: number): Promise<boolean> => {
  const cacheKey = `poll:${pollId}:is_active`;

  // Check Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached !== null) {
    return cached === "true";
  }

  // Cache miss: fetch from Postgres
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: { is_active: true },
  });

  if (!poll) {
    throw new Error("Poll not found");
  }

  // Cache in Redis with TTL of 5 minutes (300 seconds)
  await redis.set(cacheKey, poll.is_active.toString(), "EX", 300);

  return poll.is_active;
};