"use client";
import { Lang } from "@/constants";
import { changeLanguage } from "@/utilities/utilities";
import "react-datepicker/dist/react-datepicker.css";
import { authentication } from "@/configs/firebase/base";
import { useTranslation } from "react-i18next";

//REDUX
import { store } from "./store";

//HOOKS
import { useEffect } from "react";

//COMPONENTS
import DefaultLayout from "@/views/layouts/DefaultLayout";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    changeLanguage(i18n.language as Lang);
    authentication.languageCode = i18n.language;
  }, []);

  return (
    <Provider store={store}>
      <DefaultLayout>{children}</DefaultLayout>
    </Provider>
  );
}
