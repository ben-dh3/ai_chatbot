import { NextResponse } from "next/server";
import OpenAI from "openai";

console.log('API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
  
    const completion = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0125:personal::9ZJKxLMn",
      messages: body.messages,
    });
    console.log(completion.choices[0].message);
    const theResponse = completion.choices[0].message;
  
    return NextResponse.json({ output: theResponse }, { status: 200 })
  
  };