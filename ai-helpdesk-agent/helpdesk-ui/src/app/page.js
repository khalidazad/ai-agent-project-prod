"use client";

import { useState, useEffect } from "react";

export default function Home() {

  // stores all chat messages
  const [messages, setMessages] = useState([]);

  // stores text input
  const [input, setInput] = useState("");

  // stores conversation id
  const [conversationId, setConversationId] = useState(null);


  /******************************************************
   Create conversation when page loads
  ******************************************************/
  useEffect(() => {

    async function createConversation() {

      const res = await fetch("http://localhost:3000/api/conversation", {
        method: "POST"
      });

      const data = await res.json();

      setConversationId(data.id);
    }

    createConversation();

  }, []);


  /******************************************************
   Send message to backend
  ******************************************************/
  async function sendMessage() {

    if (!input) return;

    const userMessage = {
      role: "user",
      content: input
    };

    // show user message immediately
    setMessages(prev => [...prev, userMessage]);

    const res = await fetch("http://localhost:3000/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        conversationId,
        question: input
      })

    });

    const data = await res.json();

    const aiMessage = {
      role: "assistant",
      content: data.answer
    };

    setMessages(prev => [...prev, aiMessage]);

    setInput("");
  }


  return (

    <div style={{maxWidth:800, margin:"auto", padding:20}}>

      <h2>AI Helpdesk</h2>

      {/* chat window */}
      <div
        style={{
          border:"1px solid #ddd",
          height:400,
          overflowY:"scroll",
          padding:10,
          marginBottom:10
        }}
      >

        {messages.map((msg, i) => (

          <div key={i} style={{marginBottom:10}}>

            <b>{msg.role === "user" ? "You" : "AI"}:</b>
            <span style={{marginLeft:10}}>
              {msg.content}
            </span>

          </div>

        ))}

      </div>

      {/* input box */}
      <div style={{display:"flex", gap:10}}>

        <input
          style={{flex:1, padding:10}}
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask something..."
        />

        <button
          style={{padding:"10px 20px"}}
          onClick={sendMessage}
        >
          Send
        </button>

      </div>

    </div>

  );

}