import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { NextResponse } from "next/server";

const polly = new PollyClient({ region: "us-east-1" });

export async function POST(req: Request) {
  const body = await req.json();
  const { text } = body;

  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  try {
    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Joanna", // Standard voice
      Engine: "standard",
    });

    const response = await polly.send(command);

    const arrayBuffer = await response.AudioStream?.transformToByteArray();
    // @ts-ignore
    const audioBuffer = Buffer.from(arrayBuffer);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=voice.mp3",
      },
    });
  } catch (err) {
    console.error("Polly error:", err);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
}