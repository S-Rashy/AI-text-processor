import React, { useState } from "react";
import { LuSend } from "react-icons/lu";

const ChatInput = ({ onSend }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    if (inputText.trim() !== "") {
      onSend(inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); 
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        placeholder="Type your text..."
        
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyPress} 
      />
      <button className="chat-button send-button" onClick={handleSubmit}><LuSend /></button>
    </div>
  );
};

export default ChatInput;
