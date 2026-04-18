// src/i18n/index.js
import { translations } from "./translations";

export const t = (lang, key, vars) => {
  const dict = translations[lang] || translations.en;

  const val =
    key.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict) ??
    key;

  if (!vars || typeof val !== "string") return val;

  return Object.entries(vars).reduce(
    (out, [k, v]) => out.replaceAll(`{${k}}`, String(v)),
    val
  );
};

// Optional: backend/user-provided strings mapping
export const trDynamic = (lang, value) => {
  if (!value) return value;
  const map = {
    "In use": "cabin.inUse",
    "No active customer": "cabin.noActiveCustomer",
    "Walk-in": "misc.walkIn",
    None: "misc.none",
  };
  const k = map[value];
  return k ? t(lang, k) : value;
};
