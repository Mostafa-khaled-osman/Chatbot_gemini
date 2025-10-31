import React from 'react'

function ChatMessage({chat}) {
  return (
    <div className={`message ${chat.role === 'model' ? "bot" : "user" }-message`}>
      {chat.role === 'model' && <div className="msg-avatar">🤖</div>}
      <p className='message-text'>{chat.text}</p>
    </div>
  )
}

export default ChatMessage
