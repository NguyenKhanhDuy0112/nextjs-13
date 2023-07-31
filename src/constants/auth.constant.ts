import i18n from "react-i18next";

export enum CookieStorageKey {
  TOKEN_SHARE = "tokenShare",
  REFRESH_TOKEN_SHARE = "refreshTokenShare",
  REMEMBER_SHARED_TOKEN = 14,
  SUB_DOMAIN = "pizza4ps.io",
  REMEMBER_ME_KEY = "02AADCAAE6E777B27A273692959789A863A6A419",
  KEEP_ME_LOGIN_KEY = "A74B63D1DB073D8C94A91EC328AD975BF03CBB9F",
  REDIRECT_URL_4P = "redirect",
}

export enum LocalStorageKey {
  Language = "lang",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Others = "others",
}

export enum TypeSignup {
  Facebook = "Facebook",
  Google = "Google",
  Original = "Original",
}

export const OptionGenders = [
  { label: "SCR_FEMALE", value: Gender.Female },
  { label: "SCR_MALE", value: Gender.Male },
  { label: "SCR_OTHERS", value: Gender.Others },
];

export enum StatusCodeApi {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  INTERNAL_SERVER = 500,
}