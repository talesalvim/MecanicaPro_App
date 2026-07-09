import React, { createContext, useState } from 'react';
import { translations } from '../translations';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('pt');

  // t() retorna a string traduzida pela chave; fallback para a própria chave
  const t = (key) => {
    const dict = translations[language] || translations.pt;
    return dict[key] !== undefined ? dict[key] : key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}