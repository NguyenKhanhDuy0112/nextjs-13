import { CookieStorageKey, LangCode, RouteType } from "@/constants";

//MODELS
import { registerLocale  } from "react-datepicker";

//HOOKS
import { useEffect } from "react";
import { useCookieStorage } from "@/hooks";
import { useAppDispatch } from "@/redux/hook";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";

//REDUX
import { login, updateAuthState } from "@/redux/modules/authSlice/authSlice";

//COMPONENTS
import Footer from "@/views/partials/Footer";
import Header from "@/views/partials/Header";

type DefaultLayoutProps = {
    children: React.ReactNode
}

function DefaultLayout(props: DefaultLayoutProps) {
    const { children } = props;

    //HOOKS
    const { setCookie, getCookie, checkCookie } = useCookieStorage();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const pathname = usePathname();

    useEffect(() => {
        if(searchParams.has(CookieStorageKey.REDIRECT_URL_4P)){
            setCookie(CookieStorageKey.REDIRECT_URL_4P, searchParams.get(CookieStorageKey.REDIRECT_URL_4P));
            dispatch(updateAuthState({ redirectUrl: String(getCookie(CookieStorageKey.REDIRECT_URL_4P)) || searchParams.get(CookieStorageKey.REDIRECT_URL_4P) || ""}))
        }

        if(Boolean(checkCookie(CookieStorageKey.TOKEN_SHARE))){
            const access_token = String(getCookie(CookieStorageKey.TOKEN_SHARE))?.replace(/"/g, '');
            const refresh_token = String(getCookie(CookieStorageKey.REFRESH_TOKEN_SHARE))?.replace(/"/g, '');
            if(Boolean(access_token)){
                dispatch(login({access_token: String(access_token) || "", refresh_token: refresh_token || ""}));
            }
        }

    },[])

    useEffect(() => {
        async function setLocale() {
          const localeKey = i18n.language;
          const locale = await import(`date-fns/locale/${localeKey === LangCode.en ? 'en-US' : localeKey}/index.js`);
          registerLocale(localeKey, locale.default);
        }
    
        setLocale();
    }, [i18n.language]);

    return ( 
        <section className="container">
            <div className={`main ${(pathname === '/' || pathname === (RouteType.Login as string) || pathname === (RouteType.Register as string)) ? 'p-0' : ''}`}>
                <Header/>
                {children}
                <Footer/>
            </div>
        </section>
     );
}

export default DefaultLayout;