import React, { useState } from "react";

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
      event.preventDefault(); // Prevents a new line from being added
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        placeholder="Type your text..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyPress} // Handles Enter key press
      />
      <button className="chat-button" onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatInput;
