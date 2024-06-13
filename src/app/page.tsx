"use client";
import { useState } from "react";
import Image from "next/image";
import droolingHomer from "./assets/droolingHomer.gif";
import talkingHomer from "./assets/talkingHomer.gif";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Don't wake me I'm working.",
    },
  ]);

  const callGetResponse = async () => {
    setIsLoading(true);
    let temp = messages;
    temp.push({ role: "user", content: theInput });
		setMessages(temp)
    setTheInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);
  };


  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        callGetResponse();
      }
  };

// className='landingpage bg-[length:1840px_920px] bg-center flex flex-col min-h-screen w-full h-full max-w-screen-4xl'
  return(
    <main className="landingpage bg-[length:2000px_980px] bg-center flex min-h-screen flex-col items-center">
      <h1 className="mt-14 text-6xl text-yellow-400 font-PublicPixel">HomerBot</h1>

      <div className="mt-20 flex flex-row">
        <Image src={droolingHomer} alt="drooling homer" height={500} width={500} />

        <div className="flex  h-[25rem] w-[40rem] flex-col items-center">
          <div className="text-lime-400 font-PublicPixel h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
            <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
            {messages.map((e) => {
              return (
                <div key={e.content} className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${e.role === "assistant" ? "self-start " : "self-end "} `}>
                  {e.content}
                </div>
              );
            })}
            {isLoading ? <div className="self-start w-max max-w-[18rem] rounded-md px-4 py-3 h-min">...</div> : ""}
            </div>
          </div>

          <div className="relative  w-[80%] bottom-4 flex justify-center">
            <textarea value={theInput} onChange={(event) =>
            setTheInput(event.target.value)} className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none" onKeyDown={Submit} />
            <button onClick={callGetResponse} className="w-[15%] bg-blue-500 px-4 py-2 rounded-r">
              send
            </button>
          </div>
        </div>

        <Image src={talkingHomer} alt="talking homer" height={500} width={500} />

      </div>
  
    </main>
  );
}