import type { APIRoute } from "astro";

// Ensure this runs as a server endpoint, not prerendered
export const prerender = false;

interface LeonaRequestBody {
  session_id: number;
  message: string;
}

interface LeonaAPIResponse {
  output: string;
}

const LEONA_API_URL = "https://n8n.thinkshub.cloud/webhook/leona";

const jsonResponse = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse JSON body safely
  let body: LeonaRequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ output: "Invalid JSON body" }, 400);
  }

  // 2. Validate input
  const { session_id, message } = body;

  if (typeof session_id !== "number" || !Number.isFinite(session_id)) {
    return jsonResponse({ output: "session_id harus berupa angka" }, 400);
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return jsonResponse({ output: "message tidak boleh kosong" }, 400);
  }

  // 3. API key (public)
  const apiKey = "Yx14Dfqit7GuYxi7";

  // 4. Forward request to Leona API
  try {
    const response = await fetch(LEONA_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id,
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      console.error(`[Leona API] HTTP ${response.status}`);
      return jsonResponse({ output: "Chatbot sedang tidak tersedia" }, 500);
    }

    const data: LeonaAPIResponse = await response.json();

    // 5. Return chatbot response
    return jsonResponse({ output: data.output }, 200);
  } catch (error) {
    console.error("[Leona API] Request failed:", error);
    return jsonResponse({ output: "Chatbot sedang tidak tersedia" }, 500);
  }
};

// Reject non-POST methods
export const ALL: APIRoute = () =>
  jsonResponse({ output: "Method not allowed" }, 405);
