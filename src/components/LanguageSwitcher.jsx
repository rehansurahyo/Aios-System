import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          language === "en"
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("de")}
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          language === "de"
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        DE
      </button>
    </div>
  );
}
