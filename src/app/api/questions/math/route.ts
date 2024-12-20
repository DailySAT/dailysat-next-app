// backend work for math questions :)

export async function GET() {

    try {
        // Return the result with the question document
        return Response.json({ 
            message: "Coming soon!"
         });
      } catch (error) {
        // Handle any database errors
        return Response.json({
          code: 500,
          error: "Internal server error",
          errorMsg: error
        });
      }
} 