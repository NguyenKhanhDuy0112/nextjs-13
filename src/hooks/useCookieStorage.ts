import Cookies from "cookies-ts";
import moment from "moment";
import { CookieStorageKey } from "@/constants";

interface useCookieStorageProps {
  getCookie: (key: string) => void;
  setCookie: (key: string, value: any) => void;
  removeCookie: (key: string) => void;
  removeCookieShared: (key: string) => void;
  setCookieShared: (key: string, value: any, numberOfDayExpired?: number) => void;
  checkCookie: (key: string) => void;
}

const cookieStorage = new Cookies();

const useCookieStorage = (): useCookieStorageProps => {

  const getCookie = (key: string) => {
    return cookieStorage.get(key);
  };

  const checkCookie = (key: string) => {
    return Boolean(cookieStorage.isKey(key));
  };

  const setCookie = (key: string, value: any) => {
    return cookieStorage.set(key, JSON.stringify(value))
  };

  const removeCookie = (key: string) => {
    return cookieStorage.remove(key);
  };

  const removeCookieShared = (key: string) => {
    let options = {
      path: "/",
      domain: CookieStorageKey.SUB_DOMAIN as string,
    };

    return cookieStorage.remove(key, options);
  }

  const setCookieShared = (key: string, value: any, numberOfDayExpired?: number) => {
    const expires = moment()
    .add(numberOfDayExpired ? numberOfDayExpired : CookieStorageKey.REMEMBER_SHARED_TOKEN , "days")
    .toDate();

    let options = {
      path: "/",
      domain: CookieStorageKey.SUB_DOMAIN as string,
      expires: expires,
    };

    cookieStorage.set(key, JSON.stringify(value), options);
  }

  return { getCookie, setCookie, removeCookie, setCookieShared, removeCookieShared, checkCookie };
};

export default useCookieStorage;
