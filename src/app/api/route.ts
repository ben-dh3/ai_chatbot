// route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    console.time('OpenAI API call');
    const completion = await openai.chat.completions.create({
      model: "ft:gpt-4.1-mini-2025-04-14:personal:homer:BblmBmt3",
      messages: body.messages,
      max_tokens: 100,
    });
    console.timeEnd('OpenAI API call');
    const theResponse = completion.choices[0].message;
    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
