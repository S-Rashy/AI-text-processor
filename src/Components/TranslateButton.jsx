import React from "react";

const TranslateButton = ({ onTranslate, setTargetLang }) => {
  return (
    <div>
      <select className="translation-controls" onChange={(e) => setTargetLang(e.target.value)}>
        <option value="en" disabled>Select a Language</option>
        <option value="en">English</option>
        <option value="pt">Portuguese</option>
        <option value="es">Spanish</option>
        <option value="ru">Russian</option>
        <option value="tr">Turkish</option>
        <option value="fr">French</option>
      </select>
      <button className="chat-button translate-button" onClick={onTranslate}>Translate</button>
    </div>
  );
};

export default TranslateButton;
