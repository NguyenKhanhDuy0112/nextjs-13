"use client";
import { useAuth } from "@/hooks";
import LoginDesktop from "./sections/LoginDesktop";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleRedirectAfterLogin } from "@/utilities/utilities";

function LoginPage() {
  const router = useRouter();
  const { access_token } = useAuth();

  useEffect(() => {
    if(access_token){
      handleRedirectAfterLogin(router);
    }
  },[access_token])

  return (
    <section className="login">
      <LoginDesktop />
    </section>
  );
}

export default LoginPage;
