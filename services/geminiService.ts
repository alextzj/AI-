import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The specific model requested: nano banana / gemini flash image
const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates an image based on a source image and a text prompt.
 * 
 * @param base64Image The source image in base64 format (data:image/jpeg;base64,...)
 * @param prompt The style description
 * @returns The generated image as a base64 string
 */
export const generateStyledPortrait = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Strip the data URL prefix to get raw base64 data
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType, 
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct a displayable data URL
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};