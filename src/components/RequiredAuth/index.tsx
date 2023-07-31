import React from "react";
import { CookieStorageKey } from "@/constants";
import { useCookieStorage } from "@/hooks";

interface RequiredAuthProps{
    children: React.ReactNode;
}

function RequiredAuth(props: RequiredAuthProps) {
    const { children } = props;
    const { checkCookie } = useCookieStorage();

    
    if(!Boolean(checkCookie(CookieStorageKey.TOKEN_SHARE))){
        return <></>;
    }

    return ( 
        <>{children}</>
     );
}

export default RequiredAuth;