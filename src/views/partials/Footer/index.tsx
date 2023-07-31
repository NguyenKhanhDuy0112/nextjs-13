import { assetsImages } from "@/assets";import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//ICONS
import FacebookIc from "@/assets/icons/FacebookIc";
import InstagramIc from "@/assets/icons/InstagramIc";
import MediaProfileIc from "@/assets/icons/MediaProfileIc";

//COMPONENTS
import Input from "@/components/Input";
import Link from "next/link";

//HOOKS
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormSubscribe {
  email: string;
}

function Footer() {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    email: yup.string().email().required("Email address is required."),
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSubscribe>({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: FormSubscribe) => console.log(data);

  return (
    <footer className="footer">
      <section className="footer__top">
        <div className="footer__top-left">
          <div className="footer__top-left-wrapper">
            <div className="footer__top-left-logo">
              <Link className="footer__top-left-logo-link" href={"/"}>
                <img src={assetsImages.logo4p.src} alt="" />
              </Link>
              <div className="footer__top-left-group">
                <h4 className="footer__top-left-group-title">{`${t("SCR_FOOTER_COMPANY_NAME")}`}</h4>
              </div>
            </div>
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">{`${t("SCR_ADDRESS")}`}</h4>
              <p className="footer__top-left-group-des">{`${t("SCR_FOOTER_ADDRESS_CONTENT")}`}</p>
            </div>
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">{`${t("SCR_HOLINE_SUPPORT")}`}</h4>
              <p className="footer__top-left-group-des">
                <Link href={"tel:19006043"}>19006043</Link>
              </p>
            </div>
          </div>
          <div className="footer__top-left-wrapper">
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">
                {`${t("SCR_FOOTER_CERTIFICATE_SAFE_FOOD_TITLE")}`}
              </h4>
              <p className="footer__top-left-group-des">
                {`${t("SCR_FOOTER_CERTIFICATE_SAFE_FOOD_CONTENT")}`}
              </p>
            </div>
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">
                {`${t("SCR_FOOTER_CERTIFICATE_BUSSINESS_TITLE")}`}
              </h4>
              <p className="footer__top-left-group-des">
                {`${t("SCR_FOOTER_CERTIFICATE_BUSSINESS_CONTENT")}`}
              </p>
            </div>
          </div>
          <div className="footer__top-left-wrapper">
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">
                {`${t("SCR_FOOTER_TERMS_AND_CONDITIONS")}`}
              </h4>
              <ul>
                <li>
                  <Link href={"/"} className="footer__top-left-group-des link">
                    {`${t("SCR_FOOTER_TERMS_AND_CONDITIONS_GENERAL")}`}
                  </Link>
                </li>
                <li>
                  <Link href={"/"} className="footer__top-left-group-des link mt-0-5">
                    {`${t("SCR_FOOTER_PAYMENT_POLICY")}`}
                  </Link>
                </li>
                <li>
                  <Link href={"/"} className="footer__top-left-group-des link mt-0-5">
                    {`${t("SCR_FOOTER_DATA_PRIVACY_POLICY")}`}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer__top-left-group">
              <h4 className="footer__top-left-group-title">{t("SCR_FOOTER_CUSTOMER_SERVICES")}</h4>
              <ul>
                <li>
                  <Link href={"/"} className="footer__top-left-group-des link">
                    {`${t("SCR_FOOTER_SHIPPING_POLICY")}`}
                  </Link>
                </li>
                <li>
                  <Link href={"/"} className="footer__top-left-group-des link mt-0-5">
                    {`${t("SCR_FOOTER_RETURN_CANCEL_POLICY")}`}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__top-right">
          <p className="footer__top-right-title">{`${t("SCR_EMAIL_SUBCRIBE_TITLE")}`}</p>
          <form className="footer__top-right-form">
            <Input
              type="email"
              placeholder={`${t("SCR_EMAIL_SUBCRIBE_PLACHOLDER")}`}
              error={errors.email}
              register={register("email")}
            />
            <button type="button" className="btn footer__top-right-form-btn">
              {`${t("SCR_EMAIL_SUBCRIBE_BUTTON")}`}
            </button>
          </form>
          <p className="footer__top-right-title mt-0-5">{`${t("SCR_MEDIA_SOCIALS")}`}</p>
          <div className="d-flex justify-between items-center">
            <div className="d-flex gap-0-5">
              <FacebookIc height="30" width="30" />
              <InstagramIc height="30" width="30" />
              <MediaProfileIc height="30" width="30" />
            </div>
            <div className="footer__top-right-sale">
              <img src={assetsImages.logoSaleNoti.src} alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="footer__bottom">
        <p
          dangerouslySetInnerHTML={{
            __html: `${t("SCR_COPPY_RIGHT")}`.replace("[[num]]", "2022"),
          }}
        ></p>
      </section>
    </footer>
  );
}

export default Footer;
