import React, { useState, useEffect } from "react";
import "./Translator.css"; // External CSS

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState(""); 
  const [targetLang, setTargetLang] = useState("fr"); 
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  
  // Check if Chrome Translator API is available
  useEffect(() => {
    if ("ai" in self && "translator" in self.ai) {
      setIsApiAvailable(true);
    }
  }, []);

  useEffect(() => {
    console.log("🔄 Translated text updated in state:", translatedText);
  }, [translatedText]);

  const translateText = async () => {
    if (!isApiAvailable) {
      alert("Chrome Translator API is not supported in this browser.");
      return;
    }

    if (!inputText.trim()) {
      alert("Please enter text to translate.");
      return;
    }

    try {
      console.log("🚀 Fetching translator capabilities...");
      const translatorCapabilities = await self.ai.translator.capabilities();
      console.log("🌍 Translator Capabilities:", translatorCapabilities);

      const sourceLang = "en";
      const supportLevel = translatorCapabilities.languagePairAvailable(sourceLang, targetLang);
      console.log(`📡 Support level for '${sourceLang}' → '${targetLang}':`, supportLevel);

      if (supportLevel === "no") {
        alert(`Translation not supported for ${sourceLang} → ${targetLang}.`);
        return;
      }

      console.log("🔄 Creating translator instance...");
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      console.log("✅ Translator instance created:", translator);
      console.log("✨ Translating text...");

      const result = await translator.translate(inputText);
      console.log("✅ Translation API response:", result);

      if (result) {
        console.log("📌 Updating UI with:", result);
        setTranslatedText(result); // Fixed: Directly store result instead of result.translation
      } else {
        alert("❌ Translation failed: No output received.");
      }
    } catch (error) {
      console.error("⚠️ Translation error:", error);
      alert("An error occurred while translating. Check the console for details.");
    }
  };

  return (
    <div className="translator-container">
      <h2 className="translator-title">AI Translator</h2>

      {!isApiAvailable && (
        <p className="warning">⚠️ Chrome Translator API is not supported in this browser.</p>
      )}

      <textarea
        className="translator-textarea"
        placeholder="Enter text..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <select
        className="translator-select"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
      </select>

      <button className="translator-button" onClick={translateText}>
        Translate
      </button>

      {translatedText && (
        <div className="translator-result">
          <h3 className="translator-result-title">Translated Text:</h3>
          <p>{translatedText}</p> {/* Now should display the correct output */}
        </div>
      )}
    </div>
  );
};

export default Translator;
