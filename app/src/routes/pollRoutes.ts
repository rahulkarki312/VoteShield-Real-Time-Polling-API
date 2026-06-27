import {z} from "zod"; // Importing Zod for schema validation

import express from 'express';
 import {prisma} from '../lib/prisma';

 const router = express.Router();


 // Define the Zod schema for poll creation request body
const pollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long"), // Question must be a string with min length 5
  // text is a record where keys are string representations of numbers (e.g., "1", "2")
  // and values are strings with min length 1 (representing poll options)
  text: z.record(z.string().regex(/^\d+$/, "Keys must be numeric strings"), z.string().min(1, "Option text cannot be empty"))
});



 /**
 * @route POST /api/poll/new
 * @desc Create a new poll
 * @access Public
 */
router.post("/new", async (req: Request, res: Response) => {
    // Validate the request body against the Zod schema
    const parseResult = pollSchema.safeParse(req.body);

    if (!parseResult.success) {
        // If validation fails, return a 400 Bad Request with the error details
        res.status(400).json({ error: "Incorrect input format", details: parseResult.error.flatten() });
        return;
    }
 
    const {question, text} = parseResult.data; // Extract validated data

    try{
        const newPoll = await prisma.poll.create({
            data: {question, text},
        });
        res.status(201).json(newPoll);
    } catch (err) {
        console.error("Error creating poll:", err);
        res.status(500).json({error: "Failed to create poll"});
    }
});

/**
 * @route GET /api/poll/all
 * @desc Get all polls
 * @access Public
 */
router.get("/all", async (req: Request, res: Response) => {
  try {
    // Fetch all poll records from the database
    const polls = await prisma.poll.findMany();
    // Return the polls as a JSON response
    res.json(polls);
  } catch (err) {
    // If an error occurs, return a 500 Internal Server Error
    console.error("Error fetching all polls:", err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

/**
 * @route GET /api/poll/:id
 * @desc Get a single poll by ID
 * @access Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  // Parse the poll ID from the request parameters, ensuring it's a base-10 integer
  const pollId = parseInt(req.params.id, 10);

  // Check if the parsed pollId is a valid number
  if (isNaN(pollId)) {
    res.status(400).json({ error: "Invalid poll ID. ID must be a number." });
    return 
  }

  try {
    // Find a unique poll record by its ID
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    // If no poll is found with the given ID, return a 404 Not Found response
    if (!poll) {
      res.status(404).json({ error: "Poll not found" });
      return 
    }

    // Return the found poll as a JSON response
    res.json(poll);
  } catch (err) {
    // If an error occurs during database operation, return a 500 Internal Server Error
    console.error("Error retrieving poll:");
    res.status(500).json({ error: "Error retrieving poll" });
  }
});


export default router;