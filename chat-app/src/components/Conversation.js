import React from "react";

function Conversation({messages}) {
  return (
    <div
      style={{height: "300px", overflowY: "scroll", border: "1px solid #ccc"}}
    >
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.sender}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}

export default Conversation;
