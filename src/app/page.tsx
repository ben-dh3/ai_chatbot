"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import droolingHomer from "./assets/droolingHomer.gif";
import talkingHomer from "./assets/talkingHomer.gif";
import errorImage from "./assets/errorImage.webp";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Don't wake me I'm working.",
    },
  ]);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1800);
    };

    window.addEventListener('resize', checkIsMobile);

    checkIsMobile();

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return(
    <main className="landingpage bg-[length:2000px_980px] bg-center flex min-h-screen flex-col items-center">

      <div className={`space-y-8 font-PublicPixel flex flex-col items-center justify-center min-h-screen w-full max-w-screen-4xl bg-gradient-to-t from-cyan-300 to-blue-500 ${!isMobile ? 'hidden' : ''}`}>
        <div className='text-4xl text-yellow-400 text-center'>Oops...</div>
        <Image src={errorImage} height={300} width={300} alt="errorImage" />
        <div className='text-2xl text-yellow-400 text-center'>Check out the desktop version.</div>
      </div>
      {!isMobile && (
        <>
          <h1 className="mt-14 text-6xl text-yellow-400 font-PublicPixel">HomerBot</h1>

          <div className="mt-20 flex flex-row space-x-14">
            <Image src={droolingHomer} alt="drooling homer" height={500} width={500} />

            <div className="font-PublicPixel mt-8 flex  h-[25rem] w-[40rem] flex-col items-center">
              <div className="text-lime-400 h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
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
                setTheInput(event.target.value)} className="scrollbar-thumb-gray-700 w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-white outline-none" onKeyDown={Submit} />
                <button onClick={callGetResponse} className="bg-blue-500 px-4 py-2">
                  SEND
                </button>
              </div>
            </div>

            <Image src={talkingHomer} alt="talking homer" height={500} width={500} />

          </div>
        </>
      )}

    </main>
  );
}