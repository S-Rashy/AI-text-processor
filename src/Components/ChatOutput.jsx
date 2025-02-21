const ChatOutput = ({ message }) => {  // ✅ Accepts a single message
  console.log(message);
  
  return (
    <div className="text-output">

      <p>{message.text}</p>
      {message.detectedLang && <small>Language: {message.detectedLang}</small>}
      {message.translation && <p>Translation : {message.translation}</p>}
      {message.summary && <p>Summary: {message.summary}</p>}
    </div>
  );
};
export default ChatOutput
  