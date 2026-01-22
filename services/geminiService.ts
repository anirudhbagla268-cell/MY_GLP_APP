
import { GoogleGenAI } from "@google/genai";
import { Message, PatientProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIResponse(
  prompt: string, 
  history: Message[], 
  profile: PatientProfile,
  systemInstruction: string
): Promise<string> {
  try {
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
    return "AI is busy. Your doctor is notified.";
  }
}
