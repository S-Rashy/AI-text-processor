import React, { useState } from "react";
import ChatInput from "./Components/ChatInput";
import ChatOutput from "./Components/ChatOutput";
import SummarizeButton from "./Components/SummarizeButton";
import TranslateButton from "./Components/TranslateButton";

const languageMap = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French"
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [targetLang, setTargetLang] = useState("en");
  const [error, setError] = useState(""); 

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000); // Auto-hide after 3 seconds
  };

  const handleSend = async (text) => {
    if (!text.trim()) {
      showError("Please enter some text.");
      return;
    }

    const newMessage = { text };

    try {
      if ("ai" in self && "languageDetector" in self.ai) {
        const detector = await self.ai.languageDetector.create();
        const detected = await detector.detect(text);
        console.log("Language detection result:", detected);
        if (Array.isArray(detected) && detected.length > 0) {
          const detectedLangCode = detected[0].detectedLanguage || "Unknown";
          newMessage.detectedLang = languageMap[detectedLangCode] || "Unknown";
        } else {
          newMessage.detectedLang = "Unknown";
        }
      }
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error("Language detection failed:", error);
      showError("Error detecting language. Please try again.");
    }
  };

  const handleSummarize = async (index) => {
    try {
      if ("ai" in self && "summarizer" in self.ai) {
        const summarizer = await self.ai.summarizer.create({ sourceLanguage: "en" });
        const summary = await summarizer.summarize(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index] = { ...updatedMessages[index], summary };
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Summarization failed:", error);
      showError("Error summarizing text. Please try again.");
    }
  };

  const handleTranslate = async (index) => {
    try {
      if ("ai" in self && "translator" in self.ai) {
        const sourceLang = Object.keys(languageMap).find(
          key => languageMap[key] === messages[index].detectedLang
        ) || "en";
        const translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
        const translation = await translator.translate(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index] = { 
          ...updatedMessages[index], 
          translation, 
          translatedTo: languageMap[targetLang] || "Unknown" 
        };
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Translation failed:", error);
      showError("Error translating text. Please try again.");
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
       <div className="chat-header">
       {error && <div className="error-message">{error}</div>}

        
          <button className="clear-button" onClick={handleClear}>Clear Chat</button>
        </div>
      <div className="chat-container">
        
       
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-box">
              <ChatOutput message={msg} />
              <div className="button-group">
                {msg.text.length > 150 && msg.detectedLang === "English" && (
                  <SummarizeButton onSummarize={() => handleSummarize(index)} />
                )}
                <TranslateButton onTranslate={() => handleTranslate(index)} setTargetLang={setTargetLang} />
                {msg.translatedTo && <p className="translated-lang">Translated to: {msg.translatedTo}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
              <ChatInput onSend={handleSend} onEnterPress={handleSend} />

    </div>
  );
};

export default App;
