import { assetsImages } from "@/assets";
import { handleRedirectAfterLogin } from "@/utilities/utilities";
import { CookieStorageKey, RouteType, TypeSignup } from "@/constants";

//FIREBASE
import { authentication } from "@/configs/firebase/base";
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

//HOOKS
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { useAuth, useCookieStorage } from "@/hooks";

//COMPONENTS
import LoginPhoneNumber from "./LoginPhoneNumber";
import LoginEmail from "./LoginEmail";
import Link from "next/link";

//SERVICES
import { useSociaLoginApiMutation } from "@/services/authService";
import { login, updateAuthState } from "@/redux/modules/authSlice/authSlice";
import { useTranslation } from "react-i18next";

export enum LoginPhoneNumberAndEmail {
  PhoneNumber = "PhoneNumber",
  Email = "Email",
}

function LoginDesktop() {
  const [typeLogin, setTypeLogin] = useState<string>(LoginPhoneNumberAndEmail.Email);

  //HOOKS
  const { setCookieShared, removeCookie  } = useCookieStorage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { redirectUrl } = useAuth();
  const { t } = useTranslation();
 
  //SERVICES
  const [loginSocialApi] = useSociaLoginApiMutation(); 

  useEffect(() => {
    setTypeLogin(searchParams.get('typeLogin') || LoginPhoneNumberAndEmail.Email);
  },[searchParams])

  const handleAuth = async (auth_data: any) => {
    const user = auth_data.user;
    let token = "";

    await user.getIdToken().then(async (result_token: any) => {
      token = result_token;
    });

    if(token !== ""){
      dispatch(updateAuthState({ email: user?.email, phone: user?.phoneNumber, firebase_token: token }))
      try{
        const { access_token, refresh_token } = await loginSocialApi({firebase_token: token}).unwrap();

        if(access_token){
          dispatch(login({refresh_token: refresh_token || "", access_token: access_token || "", otp_token: ''}));
          setCookieShared(CookieStorageKey.TOKEN_SHARE as string, access_token || "");
          setCookieShared(CookieStorageKey.REFRESH_TOKEN_SHARE as string, refresh_token);
          handleRedirectAfterLogin(router);
          removeCookie(CookieStorageKey.REDIRECT_URL_4P);
        }
       
      }catch(err){
        router.push(`${RouteType.Register}?${CookieStorageKey.REDIRECT_URL_4P}=${redirectUrl}`);
      }
    }
  };

  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    provider.setCustomParameters({
        prompt: "select_account"
    });

    signInWithPopup(authentication, provider)
        .then((result) => {
            dispatch(updateAuthState({ typeSignup: TypeSignup.Google }))
            handleAuth(result);
        }).catch((error) => {
            console.log("Login failed google: ", error);
        });
  }

  const handleSignInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(authentication, provider)
      .then((result) => {
        dispatch(updateAuthState({ typeSignup: TypeSignup.Facebook }));
        handleAuth(result);
      })
      .catch((error) => {
        console.log("Sign in with Facebook failed: ", error);
      });
  };

  const handleChangeTypeLogin = (typeLogin: string) => {
    router.push(`?typeLogin=${typeLogin}`);
    setTypeLogin(typeLogin);
  }

  return (
    <article className="login-desktop">
      <div className="login-desktop-container">
        {typeLogin === LoginPhoneNumberAndEmail.PhoneNumber && (
          <LoginPhoneNumber onChangeTypeLogin={handleChangeTypeLogin} />
        )}

        {typeLogin === LoginPhoneNumberAndEmail.Email && (
          <LoginEmail onChangeTypeLogin={handleChangeTypeLogin} />
        )}

        <div className="login-form-social-title">
          <span>{t("SCR_OR")}</span>
        </div>
        <div className="login-form-social">
          <button className="login-form-social-btn" onClick={handleSignInWithFacebook}>
            <img className="login-form-social-btn-img" src={assetsImages.facebookLogo.src} />
            <span className="login-form-social-btn-txt">{t("SCR_SIGN_IN_FACEBOOK")}</span>
          </button>
          <button className="login-form-social-btn" onClick={handleSignInWithGoogle}>
            <img className="login-form-social-btn-img" src={assetsImages.googleLogoNormal.src} />
            <span className="login-form-social-btn-txt" >{t("SCR_SIGN_IN_GOOGLE")}</span>
          </button>
        </div>
        <div className="login-form-bottom">
          <p className="login-form-bottom-des">
            {t("SCR_DID_NOT_HAVE_AN_ACCOUNT")} <Link href={`${RouteType.Register}`}>{t("SCR_CREATE_ACCOUNT")}</Link>
          </p>
        </div>
      </div>
    </article>
  );
}

export default LoginDesktop;
