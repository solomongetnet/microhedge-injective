"use server";

import { aiConfig } from "@/config/ai.config";


interface ChatMessage {
    role: "USER" | "ASSISTANT";
    content: string;
}

export async function ai({
    message,
}: {
    message: string;
}) {
    try {
        const characterPrompt = `
You are the MicroHedger AI assistant, an expert in agricultural finance and DeFi risk management on Injective.
Your goal is to provide farmers with intelligent insights regarding their hedging strategies.
When given a commodity and a strike price, analyze the risk and provide a concise, professional, yet encouraging strategy suggestion.
Focus on:
1. Market volatility for the specific commodity.
2. The logic behind the chosen strike price.
3. Recommended protection periods (7, 14, 30 days).
Keep responses under 60 words. Always include a recommended duration and a brief rationale.
`;
        const aiContents = [
            { role: "user", parts: [{ text: characterPrompt }] },
            { role: "user", parts: [{ text: message }] },
        ];

        const aiResponse = await aiConfig.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: aiContents,
        });

        const textResponse =
            aiResponse?.text ?? "Sorry, I couldn't process that request right now.";

        return { success: true, reply: textResponse };
    } catch (error) {
        console.error("Guesthouse Management AI Error:", error);
        return {
            success: false,
            reply:
                "Something went wrong while generating the response. Please try again later.",
        };
    }
}