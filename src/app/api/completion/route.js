import OpenAI from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Travel App",
  },
});

export async function POST(req) {
  try {
    console.log("API route called");

    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Creating OpenRouter request with prompt:", prompt);

    const response = await openrouter.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      stream: false, // Use non-streaming for free models
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenRouter response received:", response);

    // Extract the content from the response
    const content =
      response.choices?.[0]?.message?.content || "No response generated";
    console.log("Extracted content:", content);

    // Return as plain text for the useCompletion hook
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API error details:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
