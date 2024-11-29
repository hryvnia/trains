"use client";

// src/components/Chat.tsx

import React, { useEffect, useRef, useState } from "react";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Подключаемся к WebSocket серверу
    ws.current = new WebSocket("ws://localhost:3005");

    ws.current.onmessage = (event) => {
      // Handle both array and string messages
      if (Array.isArray(event.data)) {
        const textMessage = String.fromCharCode(...event.data); // Convert ASCII codes to a string
        setMessages((prevMessages) => [...prevMessages, textMessage]);
      } else if (typeof event.data === "string") {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      } else {
        console.log("Received a binary message");
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && ws.current) {
      ws.current.send(input);
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div
        style={{
          border: "1px solid #ddd",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ width: "15%" }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
