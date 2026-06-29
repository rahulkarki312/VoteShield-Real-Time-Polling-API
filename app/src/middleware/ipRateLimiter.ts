import { Request, Response, NextFunction } from "express";
import { isGloballyRateLimited } from "../utils/rate_limit"; // Adjust path as needed

export const ipRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "unknown";

  // Skip rate limiting if IP is unknown
  if (ip === "unknown") {
    return next();
  }

  try {
    const limited = await isGloballyRateLimited(ip);

    if (limited) {
      return res.status(429).json({
        error: "Too many requests from this IP. Please try again later.",
      });
    }

    next(); // All good — continue to the next middleware/route
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // Fail open if Redis is down or errored
  }
};