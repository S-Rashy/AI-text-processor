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
  fr: "French",
};

const AITP = () => {
  const [messages, setMessages] = useState([]);
  const [targetLang, setTargetLang] = useState("en");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const handleSend = async (text) => {
    if (!text.trim()) {
      showError("Please enter some text.");
      return;
    }

    const newMessage = { text };
    setLoading("detecting");

    try {
      if ("ai" in self && "languageDetector" in self.ai) {
        const detector = await self.ai.languageDetector.create();
        const detected = await detector.detect(text);
        if (Array.isArray(detected) && detected.length > 0) {
          const detectedLangCode = detected[0].detectedLanguage || "Unknown";
          newMessage.detectedLang = languageMap[detectedLangCode] || "Unknown";
        } else {
          newMessage.detectedLang = "Unknown";
        }
      }
      setMessages([...messages, newMessage]);
    } catch (error) {
      showError("Error detecting language. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSummarize = async (index) => {
    setLoading(`summarizing-${index}`);

    try {
      if ("ai" in self && "summarizer" in self.ai) {
        const summarizer = await self.ai.summarizer.create({
          sourceLanguage: "en",
        });
        const summary = await summarizer.summarize(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index] = { ...updatedMessages[index], summary };
        setMessages(updatedMessages);
      }
    } catch (error) {
      showError("Error summarizing text. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleTranslate = async (index) => {
    setLoading(`translating-${index}`);

    try {
      if ("ai" in self && "translator" in self.ai) {
        const sourceLang =
          Object.keys(languageMap).find(
            (key) => languageMap[key] === messages[index].detectedLang
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
          translatedTo: languageMap[targetLang] || "Unknown",
        };
        setMessages(updatedMessages);
      }
    } catch (error) {
      showError("Error translating text. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="welcome">
          <p>Welcome to AI-TP</p>
        </div>
        <button className="clear-button" onClick={handleClear}>
          Clear Chat
        </button>
      </div>

      <div className="chat-container">
        {error && <div className="error-message">{error}</div>}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-box">
              <ChatOutput message={msg} />

              {loading === `summarizing-${index}` && (
                <p className="loading-text">Summarizing...</p>
              )}
              {loading === `translating-${index}` && (
                <p className="loading-text">Translating...</p>
              )}

              <div className="button-group">
                <TranslateButton
                  onTranslate={() => handleTranslate(index)}
                  setTargetLang={setTargetLang}
                />

                {msg.text.length > 150 && msg.detectedLang === "English" && (
                  <SummarizeButton onSummarize={() => handleSummarize(index)} />
                )}
                {/* {msg.translatedTo && <p className="translated-lang">Translated to: {msg.translatedTo}</p>} */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChatInput onSend={handleSend} onEnterPress={handleSend} />
    </div>
  );
};

export default AITP;
