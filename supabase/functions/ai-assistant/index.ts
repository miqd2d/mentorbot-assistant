
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIAssistantRequest {
  message: string;
  context?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }

    // Parse request
    const data: AIAssistantRequest = await req.json();
    
    if (!data.message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Received message:", data.message);
    
    // Prepare context for educational assistant
    const context = data.context || "You are an AI assistant for an educational platform. " + 
      "You help professors with information about students, classes, and assignments. " + 
      "Keep responses concise, professional, and focused on educational context.";
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${context}\n\nUser: ${data.message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    const result = await response.json();
    console.log("Gemini API response:", JSON.stringify(result));

    if (result.error) {
      throw new Error(`Gemini API error: ${result.error.message}`);
    }

    // Extract the response from Gemini's result structure
    const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "I couldn't generate a response at this time.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in AI assistant function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
