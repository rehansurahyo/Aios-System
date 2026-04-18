// // // src/context/LanguageContext.jsx
// // import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// // import { translations } from "../i18n"; // ✅ correct (from src/i18n/index.js)

// // const LanguageContext = createContext(null);

// // export function LanguageProvider({ children }) {
// //   const [language, setLanguage] = useState(() => {
// //     return localStorage.getItem("aios:lang") || "en";
// //   });

// //   useEffect(() => {
// //     localStorage.setItem("aios:lang", language);
// //   }, [language]);

// //   const value = useMemo(() => {
// //     const supported = Object.keys(translations);
// //     const safeLang = supported.includes(language) ? language : "en";
// //     return { language: safeLang, setLanguage };
// //   }, [language]);

// //   return (
// //     <LanguageContext.Provider value={value}>
// //       {children}
// //     </LanguageContext.Provider>
// //   );
// // }

// // export function useLanguage() {
// //   const ctx = useContext(LanguageContext);
// //   if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
// //   return ctx;
// // }


// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// const LanguageContext = createContext(null);

// const STORAGE_KEY = "aios_language"; 

// export function LanguageProvider({ children }) {
//   const [language, setLanguage] = useState(() => {
//     return localStorage.getItem(STORAGE_KEY) || "en";
//   });

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, language);
//   }, [language]);

//   const value = useMemo(() => ({ language, setLanguage }), [language]);

//   return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
// }

// export function useLanguage() {
//   const ctx = useContext(LanguageContext);
//   if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
//   return ctx;
// }

import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aios_language') || 'en';
    }
    return 'en';
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aios_language', language);
    }
  }, [language]);

  // Check if language is German
  const isGerman = language === 'de';

  // Function to switch language
  const switchLanguage = (lang) => {
    if (['en', 'de'].includes(lang)) {
      setLanguage(lang);
      // Force a small delay to ensure state is updated before any dependent operations
      setTimeout(() => {
        // Dispatch custom event for components that need to react to language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
      }, 100);
    }
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('aios_language');
    if (savedLang && ['en', 'de'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: switchLanguage, isGerman }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;