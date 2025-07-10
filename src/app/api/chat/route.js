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
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const response = await openrouter.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      stream: false,
      messages,
    });

    const content =
      response.choices?.[0]?.message?.content || "No response generated";

    // ✅ return only the content string, NOT JSON
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(error.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
