"use client";
import { assetsImages } from "@/assets";
import LogoHeaderDesktop from "@/assets/icons/LogoHeaderDesktop";
import { LangCode } from "@/constants";
import { changeLanguage } from "@/utilities/utilities";

import Link from "next/link";

//HOOKS
import { useTranslation } from "next-i18next";

function HeaderDesktop() {
    const { i18n: { language }, t } = useTranslation();

    const handleToggleLanguage = () => {
        changeLanguage(language === LangCode.en ? LangCode.vi : LangCode.en)
    }

    return ( 
        <section className="header-desktop">
            <div className="header-container d-flex items-center">
                <Link href="/" className="d-flex items-center">
                   <LogoHeaderDesktop height="25"/>
                </Link>
                <ul className="d-flex u-align-items-center">
                    <li className="d-flex items-center phone-link mr-10">
                        <img src={assetsImages.phoneWhiteImg.src} alt="" />
                        <span>{`${t("SCR_HOTLINE")}`}:</span>
                        <a
                            className="phone-link d-flex items-center"
                            href="tel:19006043"
                        >
                            <span className="phone-link">19006043</span>
                        </a>
                    </li>
                    <button
                        onClick={handleToggleLanguage}
                        className="btn-toggle-change-lang"
                    >
                        <div className="d-flex items-center">
                            <img src={language === LangCode.vi ? assetsImages.langEnIc.src : assetsImages.IcLangVi.src} className="toggle-change-lang" alt=""/>
                            <span className="toggle-change-lang-title">{language === LangCode.vi ? 'English' : 'Tiếng việt'}</span>
                        </div>
                    </button>
                </ul>
            </div>
        </section>
     );
}

export default HeaderDesktop;