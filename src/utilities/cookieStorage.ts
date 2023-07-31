import { CookieStorageKey } from "@/constants";
import Cookies from "cookies-ts";
import moment from "moment";

const cookies = new Cookies();

const get = (key: string) => {
  return cookies.get(key);
};

const remove = (key: string) => {
  return cookies.remove(key);
};

const set = (key: string, value: any, options: any) => {
  return cookies.set(key, value, options);
};

export const cookiesStorage = {
  get,
  set,
  remove,
};
