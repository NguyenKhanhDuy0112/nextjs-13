"use client"
import { handleRedirectAfterLogin } from "@/utilities/utilities";

//COMPONENTS
import RegisterDesktop from "./sections/RegisterDesktop";

//HOOKS
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { useEffect } from "react";

function Register() {
    const router = useRouter();
    const { access_token } = useAuth();
  
    useEffect(() => {
      if(access_token){
        handleRedirectAfterLogin(router);
      }
    },[])

    return ( 
        <section className="login">
            <RegisterDesktop/>
        </section>
     );
}

export default Register;