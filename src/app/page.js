"use client";

import { useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;

    let index = 0;
    setTypedMessage("");

    const interval = setInterval(() => {
      setTypedMessage((prev) => prev + last.content.charAt(index));
      index++;
      if (index >= last.content.length) {
        clearInterval(interval);
      }
    }, 20); // Adjust typing speed here

    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typedMessage]);

  return (
    <div className="max-w-xl mx-auto h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1 && m.role === "assistant";
          return (
            <div key={i} className="p-2 rounded bg-gray-100">
              <strong>{m.role === "user" ? "You" : "AI"}:</strong>{" "}
              {isLast ? typedMessage : m.content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="italic text-gray-500 px-2">AI is working...</div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex items-center gap-2 bg-white"
      >
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
