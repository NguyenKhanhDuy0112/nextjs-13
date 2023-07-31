import { assetsImages } from "@/assets";
import BackIc from "@/assets/icons/BackIc";

//REDUX
import { logout } from "@/redux/modules/authSlice/authSlice";

import { generateGreetings } from "@/utilities/utilities";

//HOOKS
import { useAppDispatch } from "@/redux/hook";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import useProfile from "@/hooks/useProfile";

function HeaderMobile() {
    const { t } = useTranslation();
    const { back } = useRouter();
    const { first_name, last_name } = useProfile();
    const dispatch = useAppDispatch();

    return ( 
        <section className="header__mobile">
            <div className="header__mobile-wrapper">
                <div className="header__mobile-avatar">
                    <img src={assetsImages.faceLoggedWhiteIc.src} alt=""/>
                </div>
                <div className="header__mobile-username">
                    {t(generateGreetings())}{`${first_name || last_name ? ',' : ''} ${first_name || ''} ${last_name || ''}`}
                </div>
            </div>
            <div onClick={() => back()} className="header__mobile-back">
                <BackIc/>
            </div>
            <div onClick={() => dispatch(logout())} className="header__mobile-logout">
                <span className="header__mobile-logout-txt">{t("SCR_SIGN_OUT")}</span>
                <img className="header__mobile-logout-icon" src={assetsImages.logoutIc.src} alt=""/>
            </div>
        </section>
     );
}

export default HeaderMobile;