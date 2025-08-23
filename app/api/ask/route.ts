import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { context, question } = await request.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    // Improved relevance check prompt
    const relevanceCheck = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful assistant. Given the context below, answer only 'yes' if the user's question is answerable using the context, otherwise answer 'no'.` },
        { role: "system", content: `Context: ${context}` },
        { role: "user", content: `Is the following question answerable using the context? Question: ${question}` },
      ],
    });
    const relevance = relevanceCheck.choices[0].message?.content?.toLowerCase().trim();
    if (!relevance?.startsWith("yes")) {
      return NextResponse.json({ answer: "Your question does not appear to be relevant to this topic. Please ask a topic-related question." });
    }
    // If relevant, answer as normal
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful assistant. Use the following context to answer questions: ${context}` },
        { role: "user", content: question },
      ],
    });
    return NextResponse.json({ answer: completion.choices[0].message?.content || "No answer" });
  } catch {
    return NextResponse.json({ answer: "Error" });
  }
}
