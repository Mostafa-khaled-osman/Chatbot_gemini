import React, { useRef } from 'react'

export default function ChatForm({ setChatHistory, generateBotResponse }) {
  const inputRef = useRef();
  async function onSend(e) {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // Add user message to chat
    setChatHistory(history => [...history, {role: "user", text: userMessage}]);
    
    // Add temporary "thinking" message
    setChatHistory(history => [...history, {role: "model", text: "thinking..."}]);
    
    try {
      // Generate bot response
      await generateBotResponse(userMessage);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(history => [...history, {
        role: "model",
        text: "Sorry, I encountered an error. Please try again."
      }]);
    }
  }

  return (
    <form className="chat-input" onSubmit={onSend}>
      <input ref={inputRef} aria-label="Message" placeholder="Message" />
      <button type="submit" className="send-btn" required>Send</button>
    </form>
  )
}
