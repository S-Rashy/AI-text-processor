const ChatOutput = ({ message }) => {  
  
  return (
    <div className="text-output">

      <p>{message.text}</p>
      {message.detectedLang && <small><span>Language</span>: {message.detectedLang}</small>}
      {message.translation && <p>Translation : {message.translation}</p>}
      {message.translatedTo && <p><span>Translated to </span>: {message.translatedTo}</p>}
      {message.summary && <p>Summary: {message.summary}</p>}
    </div>
  );
};
export default ChatOutput
  