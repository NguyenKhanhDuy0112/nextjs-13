import { saveLangCode } from "@/configs/translate/i18n";
import { CookieStorageKey, Lang } from "@/constants";
import moment from "moment";
import i18n from "i18next";
import { cookiesStorage } from "./cookieStorage";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

//convert file to base64
export function getBase64(img: File, callback: (data: ArrayBuffer | string | null) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function formatCash(number: number) {
  if (!Number(number)) return "0.0";
  var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);
  var priceWithCommas = Number(number).toLocaleString();
  var arParts = String(priceWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = arParts.length > 1 ? arParts[1] : "";
  decPart = (decPart + "00").substr(0, 2);
  return intPart + DecimalSeparator + decPart;
}

export const isLowerCase = (str: string) => {
  return str !== str.toUpperCase();
};

export const isUppercase = (str: string) => {
  return str !== str.toLowerCase();
};

export const checkSpecialCharacter = (str: string) => {
  let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return format.test(str);
};

export const checkValidEmail = (str: string) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
};

export const compareString = (str1: string, str2: string) => {
  return String(str1).toLowerCase().localeCompare(String(str2).toLowerCase());
};

export const convertTimestamp = (timestamp: number | string) => {
  const date = new Date(Number(timestamp) * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return `${formattedDate} ${formattedTime}`;
};

export const padZero = (number: number): string => {
  if (number < 10) {
    return "0" + number;
  }
  return number.toString();
};

export const formatNumber = (num: number) => {
  if (num < 10) {
    return "0" + num;
  }
  return num;
};

// For moment, only en is loaded as default
const loadedMomentLanguages = ["en"];

// Change language and set new locale to related features
export const changeLanguage = (language: Lang) => {
  // Set locale for moment
  if (!loadedMomentLanguages.includes(language)) {
    require(`moment/locale/${language}`);
    loadedMomentLanguages.push(language);
  }

  if (i18n.language === language) {
    return;
  }

  moment.locale(language);

  // Change locale
  saveLangCode(language);
  i18n.changeLanguage(language);
};

export const RegExp = {
  Email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PhoneNumber:  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
};

export const handleRedirectAfterLogin = (router: AppRouterInstance) => {
  const redirectUrl = cookiesStorage.get(CookieStorageKey.REDIRECT_URL_4P);
  const cleanRedirectUrl = redirectUrl?.replace(/"/g, '');

  const redirectDefault = "/profile";
  const cleanRedirectUrlDefault = redirectDefault?.replace(/"/g, '');

  if(cleanRedirectUrl) 
    return window.location.href = cleanRedirectUrl;
  
  return router.push(cleanRedirectUrlDefault)
}

export const generateGreetings = () => {
  const currentHour = Number(moment().format("HH"));
  
  if (currentHour >= 3 && currentHour < 12) {
    return "SCR_MORNING";
  } else if (currentHour >= 12 && currentHour < 15) {
    return "SCR_AFTERNOON";
  } else if (currentHour >= 15 && currentHour < 20) {
    return "SCR_EVENING";
  } else if (currentHour >= 20 && currentHour < 3) {
    return "SCR_NIGHT";
  } else {
    return "SCR_HELLO";
  }
}
