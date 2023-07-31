"use client";
import { assetsImages } from "@/assets";
import { MEDIA_LINKS, OUTSIDE_LINK, ProfileRouteType, QueryParamsType, RouteType } from "@/constants";

//COMPONENTS
import Link from "next/link";

//HOOKS
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import { useMemo } from "react";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/modules/authSlice/authSlice";

function ProfileSidebar() {
    //HOOKS
    const { t } = useTranslation();
    const { first_name, last_name } = useProfile();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const isPageProfile = useMemo(() => {
        return searchParams.has(QueryParamsType.ProfileType)
    },[searchParams])
    
    return ( 
        <article className={`profile__sidebar ${isPageProfile ? 'isPageProfile' : ''}`}>
            <div className="profile__sidebar-content">
                <div className="profile__sidebar-title">
                    <h2>{t("SCR_MY_ACCOUNT")}</h2>
                </div>
                <div className="profile__sidebar-avatar">
                    <div className="profile__sidebar-avatar-img">
                        <img src={assetsImages.faceLoggedPrimaryIc.src} alt=""/>
                    </div>
                    <div className="profile__sidebar-avatar-name">
                        <h2>{ first_name || "" } { last_name || "" } </h2>
                    </div>
                </div>
                <ul className="profile__sidebar-menu">
                    <li className="profile__sidebar-menu-item">
                        <Link href={`${RouteType.Profile}?${QueryParamsType.ProfileType}=${ProfileRouteType.ViewProfile}`} className={`profile__sidebar-menu-item-link ${searchParams.get(QueryParamsType.ProfileType) === ProfileRouteType.ViewProfile || searchParams.get(QueryParamsType.ProfileType) === ProfileRouteType.EditProfile ? 'active' : ''}`}>
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.InfoProfileIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t("SCR_PERSONAL_INFORMATION")}</span>
                        </Link>
                    </li>
                    <li className="profile__sidebar-menu-item">
                        <Link target="_blank" rel="noreferrer" href={OUTSIDE_LINK.URL_INVOICE_REDIRECT} className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.EInvoiceProfile.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t("SCR_RED_INVOICE")}</span>
                        </Link>
                    </li>
                    <li className="profile__sidebar-menu-item">
                        <Link target="_blank" rel="noreferrer" href={OUTSIDE_LINK.URL_DELI_REDIRECT} className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.orderProfileIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t("SCR_DELIVERY_SITE")}</span>
                        </Link>
                    </li>
                    <hr></hr>
                    <li className="profile__sidebar-menu-item">
                        <Link target="_blank" rel="noreferrer" href={MEDIA_LINKS.Menu_PDF} className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.pdfProfileIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t('SCR_MENU_PDF')}</span>
                        </Link>
                    </li>
                    <li className="profile__sidebar-menu-item">
                        <Link target="_blank" rel="noreferrer" href={MEDIA_LINKS.Reheating_Video} className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.videoProfileIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t('SCR_REHEATING_VIDEO')}</span>
                        </Link>
                    </li>
                    <li className="profile__sidebar-menu-item">
                        <Link target="_blank" rel="noreferrer" href={MEDIA_LINKS.Pizza_Meditation} className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.mediaProfileIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t('SCR_PIZZA_MEDITATION')}</span>
                        </Link>
                    </li>
                    <li onClick={() => dispatch(logout())} className="profile__sidebar-menu-item profile__sidebar-menu-item-logout">
                        <div className="profile__sidebar-menu-item-link">
                            <img className="profile__sidebar-menu-item-img" src={assetsImages.logoutIc.src} alt=""/>
                            <span className="profile__sidebar-menu-item-name">{t('eri_common_logout')}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </article>
     );
}

export default ProfileSidebar;