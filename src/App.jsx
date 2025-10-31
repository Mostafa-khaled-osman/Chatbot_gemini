import React, { useState } from "react";
import "./index.css";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/chatMessage";

export default function App() {
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const generateBotResponse = async (message) => {
    setIsLoading(true);
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    try {
      console.log("Sending request to Gemini API...");
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        })
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from API");
      }

      const botMessage = data.candidates[0].content.parts[0].text;
      
      // Remove the "thinking..." message if it exists
      setChatHistory(history => history.filter(msg => msg.text !== "thinking..."));
      
      // Add the bot's response
      setChatHistory(history => [...history, {
        role: "model",
        text: botMessage
      }]);
    } catch (error) {
      console.error("Error generating bot response:", error);
      // Remove the "thinking..." message
      setChatHistory(history => history.filter(msg => msg.text !== "thinking..."));
      // Add error message
      setChatHistory(history => [...history, {
        role: "model",
        text: "Sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const messages = [
    { id: 1, from: "bot", text: "Hey there 👋\nHow can I help you today?" },
  ];

  function toggleOpen() {
    setOpen((v) => !v);
  }

  return (
    <div className="app-root">
      <div className="page-bg" />

      <div
        className={`chat-panel ${open ? "open" : ""}`}
        role="dialog"
        aria-label="Chatbot panel"
      >
        <div className="chat-header">
          <div className="chat-title">
            <div className="avatar">🤖</div>
            <div className="title-text">Chatbot</div>
          </div>
          <button
            className="collapse-btn"
            aria-label="Collapse chat"
            onClick={toggleOpen}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="chat-body">
          <div className="messages" aria-live="polite">
            {messages.map((m) => (
              <div className='message bot'>
                {m.from === "bot" && <div className="msg-avatar">🤖</div>}
                <div className="msg-bubble">
                  Hey there 👋 How can I help you today?
                </div>
              </div>
            ))}

            {/* render the chat history dynamically */}
            <div className="user">
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
          </div>

          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>

      <div className="floating-controls">
        {!open && (
          <button className="fab" aria-label="Open chat" onClick={toggleOpen}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {open && (
          <button
            className="fab small"
            aria-label="Close chat"
            onClick={toggleOpen}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
