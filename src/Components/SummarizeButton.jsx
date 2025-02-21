import React from "react";

const SummarizeButton = ({ onSummarize }) => {
  return <button className="chat-button" onClick={onSummarize}>Summarize</button>;
};

export default SummarizeButton;
