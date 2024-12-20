import client from "../../../../lib/mongo";
import { Db, Document } from "mongodb";

/**
 * @swagger
 * /api/question/reading:
 *   get:
 *     description: 
 *       Retrieves a random question from the "questions" collection in MongoDB based on the provided `topic`.
 *       If the `topic` query parameter is not provided, the API will return an error.
 *     parameters:
 *       - name: topic
 *         in: query
 *         description: The topic or skill for which a random question should be fetched.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A random question that matches the provided topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc_array:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the question document in MongoDB.
 *                       question:
 *                         type: string
 *                         description: The text of the question.
 *                       skill:
 *                         type: string
 *                         description: The topic or skill associated with the question.
 *                       answer:
 *                         type: string
 *                         description: The answer to the question.
 *       400:
 *         description: Missing or invalid `topic` query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code indicating the error type.
 *                 error:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 *       500:
 *         description: Internal server error, including database connection issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code indicating the error type.
 *                 error:
 *                   type: string
 *                   description: A generic error message for internal server issues.
 */
export async function GET(request: Request) {
  const url: URL = new URL(request.url);
  const searchParams: URLSearchParams = new URLSearchParams(url.search);
  const topic: string = searchParams.get("topic") || "";

  // Check if the topic query parameter is provided
  if (topic === "") {
    return Response.json({
      code: 400,
      error: "no topic parameter specified", // Adjusted to 400 for client-side error
    });
  } else {
    try {
      await client.connect();
      const db: Db = client.db("DailySAT");
      const doc = db
        .collection("questions")
        .aggregate([{ $match: { skill: topic } }, { $sample: { size: 1 } }]);

      const doc_array: Document[] = await doc.toArray();

      // Return the result with the question document
      return Response.json({ doc_array });
    } catch (error) {
      // Handle any database errors
      return Response.json({
        code: 500,
        error: "Internal server error",
        errorMsg: error
      });
    }
  }
}
