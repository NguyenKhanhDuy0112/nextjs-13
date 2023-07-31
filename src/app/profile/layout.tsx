"use client";
import ProfileSidebar from "@/views/pages/Profile/sections/ProfileSidebar";
import type { Metadata } from "next";
import { useTranslation } from "react-i18next";

export const metadata: Metadata = {
  title: "Pizza 4P'S Delivery - Login",
  description: "The delivery web application of Pizza 4P's",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

  return (
    <section className="profile">
        <div className="wrapper">
            <ul className="breadcrumb">
                <li>{t("SCR_HOME")}</li>
                <li>{">"}</li>
                <li>{t("SCR_MY_ACCOUNT")}</li>
                <li>{">"}</li>
                <li>{t("SCR_PERSONAL_INFORMATION")}</li>
            </ul>
            <div className="profile__wrapper">
                <ProfileSidebar/>
                {children}
            </div>
        </div>
    </section>
  );
}
