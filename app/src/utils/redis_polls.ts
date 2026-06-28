import redis from '../lib/redis'


export const getPollKey = (pollId: number, suffix: string): string =>
  `poll:${pollId}:${suffix}`;



/**
 * Atomically records a vote and logs the voter's session ID using a pipeline.
 */
export const registerAnonymousVote = async (
  pollId: number,
  option: string,
  sessionId: string
): Promise<void> => {
  const voteKey = getPollKey(pollId, "votes");
  const votedKey = getPollKey(pollId, "voted");
  

  const voteEvent = JSON.stringify({
    sessionId,
    option,
    timestamp: Date.now(),
  });

  const pipeline = redis.pipeline();

  // Increment vote for the selected option
  pipeline.hincrby(voteKey, option, 1);

  // Record the session ID in the voted set
  pipeline.sadd(votedKey, sessionId);


  await pipeline.exec(); // Execute both operations together
};

// Adds a session Id to the Redis set of voters for this poll

export const recordVoteSession = async (pollId: number, sessionId: string): Promise<void> => {
    const key = getPollKey(pollId, "voted");
    await redis.sadd(key, sessionId); // Set: poll:123:voted => {  sid1, sid2, ...}
}
 
// Checks if a session Id has already voted on this poll.

export const hasSessionVoted = async (pollId: number, sessionId: string): Promise<boolean> =>{

    const key = getPollKey(pollId, "voted");
    const result = await redis.sismember(key, sessionId);
    return result === 1;
}