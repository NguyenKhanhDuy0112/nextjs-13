import i18n from "i18next";
import Fetch from "i18next-fetch-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import locale from "./locales.json";

// CONSTANTS
import { CookieStorageKey, Lang, LangCode, LocalStorageKey, env } from "@/constants";
import { cookiesStorage } from "@/utilities/cookieStorage";
import moment from "moment";

const {
   languages,
   defaultLanguage,
   namespaces,
   defaultNamespace,
   namespaceSeparator,
   keySeparator,
   pluralSeparator,
} = locale as {
   languages: Lang[];
   defaultLanguage: Lang;
   [name: string]: any;
};

const resources = {} as { [lang: string]: { [namespace: string]: any } };
languages.forEach((lang: string) => {
   resources[lang] = {};
   namespaces.forEach((namespace: string) => {
      const translations = require(`../../locales/${lang}/common.json`);
      resources[lang][namespace] = translations;
   });
});

export const saveLangCode = (lang: Lang) => {
   let options = {
      path: "/",
      domain: CookieStorageKey.SUB_DOMAIN,
      expires: moment()
         .add(CookieStorageKey.REMEMBER_SHARED_TOKEN, "days")
         .toDate(),
   };
   localStorage.setItem(LocalStorageKey.Language, lang);
   cookiesStorage.set(LocalStorageKey.Language, lang, options);
};

export const getLangCode = (): Lang => {
   if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      return LangCode.en
   }

   let lang = cookiesStorage.get(LocalStorageKey.Language) as Lang | null;

   if (!lang) {
      lang = localStorage.getItem(LocalStorageKey.Language) as Lang | null;
   }

   if (lang && resources.hasOwnProperty(lang)) return lang;

   // If language code is not saved, guest language based on browser
   lang = navigator.language.split(/[-_]/)[0] as Lang | null;

   if (!lang || !resources.hasOwnProperty(lang)) {
      lang = defaultLanguage;
   }

   saveLangCode(lang);

   return lang;
};

const lang = getLangCode();

i18n
   .use(Fetch)
   .use(LanguageDetector)
   .use(initReactI18next)
   .init({
      resources,
      debug: env.ENV !== "production",
      lng: lang || "vi",
      ns: namespaces,
      defaultNS: defaultNamespace,
      nsSeparator: namespaceSeparator,
      keySeparator: keySeparator,
      pluralSeparator: pluralSeparator,

      interpolation: {
         escapeValue: false, // not needed for react as it escapes by default
         prefix: "[[",
         suffix: "]]",
      },
      fallbackLng: "vi",
      react: {
         useSuspense: false,
      },
   });

export default i18n;
