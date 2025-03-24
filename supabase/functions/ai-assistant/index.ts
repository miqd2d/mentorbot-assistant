
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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
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
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: context },
          { role: "user", content: data.message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    console.log("OpenAI response:", JSON.stringify(result));

    if (result.error) {
      throw new Error(`OpenAI API error: ${result.error.message}`);
    }

    const aiResponse = result.choices[0].message.content;

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
