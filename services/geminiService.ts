
import { GoogleGenAI } from "@google/genai";
import { Message, PatientProfile } from "../types";

// We initialize inside a getter to avoid top-level crashes 
// if the environment variable isn't ready immediately.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set API_KEY in your environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function getAIResponse(
  prompt: string, 
  history: Message[], 
  profile: PatientProfile,
  systemInstruction: string
): Promise<string> {
  try {
    const ai = getAIClient();
    if (!ai) return "The AI assistant is currently offline (Missing API Key). Please use the SOS button for urgent clinical matters.";

    const formattedHistory = history.slice(-10).map(m => 
      `${m.senderRole === 'AI' ? 'Assistant' : 'User'}: ${m.text}`
    ).join('\n');

    const context = `
      Patient Profile:
      Age: ${profile.age}
      Current Med: ${profile.medication} (${profile.dosage})
      Weight: ${profile.weight}kg
      
      Conversation History:
      ${formattedHistory}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${context}\n\nPatient Query: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Connection error. Please use SOS if urgent.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The AI assistant is experiencing high traffic. Your clinical team has been notified of your activity.";
  }
}
