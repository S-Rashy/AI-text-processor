import React from "react";

const SummarizeButton = ({ onSummarize }) => {
  return <button className="chat-button summarize-button" onClick={onSummarize}>Summarize</button>;
};

export default SummarizeButton;
