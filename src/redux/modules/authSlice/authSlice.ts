import { CookieStorageKey, Gender, RouteType, TypeSignup } from "@/constants";
import { useCookieStorage } from "@/hooks";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthProps  {
  access_token?: string;
  refresh_token?: string;
  otp_token?: string;
  firebase_token?: string;
  email?: string;
  gender?: Gender;
  birthday?: string;
  password?: string;
  phone?: string;
  typeSignup?: TypeSignup;
  redirectUrl?: string;
}

const initialState: AuthProps = {
  access_token: "",
  refresh_token: "",
  otp_token: "",
  firebase_token: "",
  email: "",
  birthday:"",
  password: "",
  phone: "",
  typeSignup: TypeSignup.Original,
  redirectUrl: "",
};
const { getCookie, setCookieShared, removeCookie, removeCookieShared, checkCookie } = useCookieStorage();

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthProps>) => {
      const access_token = action.payload.access_token;
      const refresh_token = action.payload.refresh_token;

      state.access_token = access_token;
      state.refresh_token = refresh_token;
      setCookieShared(CookieStorageKey.TOKEN_SHARE as string, access_token || "");
      setCookieShared(CookieStorageKey.REFRESH_TOKEN_SHARE as string, refresh_token);
    },
    logout: (state) => {
      const redirectUrl = getCookie(CookieStorageKey.REDIRECT_URL_4P);
      const cleanRedirectUrl = Boolean(redirectUrl) ? String(redirectUrl).replace(/"/g, '') : '';
      removeCookieShared(CookieStorageKey.TOKEN_SHARE as string);
      removeCookieShared(CookieStorageKey.REFRESH_TOKEN_SHARE as string);
      removeCookie(CookieStorageKey.REDIRECT_URL_4P);
      
      if(Boolean(checkCookie(CookieStorageKey.REDIRECT_URL_4P))){
        window.location.href = cleanRedirectUrl;
      }else{
        window.location.href = RouteType.Login;
      }

      return {...initialState}
    },
    updateAuthState: (state, action: PayloadAction<Partial<AuthProps>>) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
});

export default authSlice.reducer;

export const {
  login,
  updateAuthState,
  logout,
} = authSlice.actions;
