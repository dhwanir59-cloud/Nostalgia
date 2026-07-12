import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lazy-loaded Gemini SDK client
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is not configured. Running with fallback response logic.");
    return null;
  }
  aiInstance = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiInstance;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Childhood Story Creator (Feature 22, 51)
app.post("/api/gemini/generate-story", async (req, res) => {
  const { prompt, details, type } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const ai = getAI();
  if (!ai) {
    // Elegant fallback for missing API Key
    const fallbackStories: { [key: string]: string } = {
      default: `[Offline Mode: Configure GEMINI_API_KEY in Secrets for custom AI storytelling!]\n\nEvery evening, as the grandfather clock chimed 5 PM, the quiet streets transformed. Children poured out of doors, clutching wooden sticks and makeshift balls. This was the arena. A single brick served as wickets, and arguments over lbw decisions were settled by the oldest kid on the block. The simple joy of chasing a ball under the setting sun, sharing a cold popsicle from the passing vendor, and returning home with dusty knees was our true gold.`,
      cricket: `Every evening at 5 PM sharp, the narrow street transformed into a grand colosseum. We had one bat, bound together with black electric tape, and a tennis ball that had lost its fuzz months ago. Wickets were three brick towers stacked precariously. Neighbors watched nervously as we launched shots that narrowly missed windows. But those dirty knees, the heated debates about who got out, and the shared sip of local orange soda—that was our kingdom.`,
      cartoon: `It was a sacred ritual. The minute school bags hit the floor, we dashed to the TV. We huddled in front of the box, waiting through the static, to watch our favorite cartoon champions. The colorful animations and epic theme songs filled the room, whisking us away to worlds of magic and adventure while moms yelled from the kitchen about doing homework.`,
    };
    const key = prompt.toLowerCase().includes("cricket") ? "cricket" : prompt.toLowerCase().includes("cartoon") ? "cartoon" : "default";
    return res.json({ text: fallbackStories[key] });
  }

  try {
    const model = "gemini-3.5-flash";
    let systemPrompt = "You are a warm, nostalgic, descriptive writer who captures the pure essence of childhood in the late 1990s and 2000s. Keep your stories vivid, short, and highly emotional.";
    if (type === "one-day") {
      systemPrompt += " Generate a timeline story covering key points of a perfect childhood day (Morning prep, school bus, back home, cartoons, evening play, bedtime).";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: `Write a short nostalgic childhood story (approx 150-200 words) based on the user's prompt: "${prompt}". Add sensory details (sounds, smells, feelings) and end with a touching concluding sentence. Extra details provided: ${JSON.stringify(details || {})}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Story Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate nostalgic story." });
  }
});

// AI Nostalgia Companion Chat (Feature 49)
app.post("/api/gemini/companion-chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getAI();
  if (!ai) {
    // Friendly fallback
    return res.json({
      text: "Hey buddy! [Offline Mode: Configure GEMINI_API_KEY to enable live AI Chat]. Remember when we used to play outside until the streetlights came on? Or when we blew into game cartridges to make them work? Those were the days! What is your favorite childhood memory?",
    });
  }

  try {
    const model = "gemini-3.5-flash";
    const systemInstruction = `You are "Sunny", a friendly, empathetic childhood best friend from the late 90s/2000s inside the REWIND platform.
You are chatting with the user as if you grew up together. Mention retro items like cassettes, dial-up, Tamagotchis, landline phones, cartoon evenings, school snacks, and paper boats.
Keep responses conversational, warm, brief (under 80 words), and end with an engaging question about their past.`;

    // Construct format expected by the SDK
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Companion Chat Error:", error);
    res.status(500).json({ error: error.message || "Companion is currently lost in thought." });
  }
});

// ----------------------------------------------------
// STATIC ASSETS & VITE MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, mount Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorldVerse REWIND server running on http://localhost:${PORT}`);
  });
}

startServer();
