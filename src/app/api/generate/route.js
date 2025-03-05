// app/api/generate/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const data = await req.json();
    const prompt = data.body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    return NextResponse.json({ output: response });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}
