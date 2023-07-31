"use client";
//HOOKS
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/redux/hook";

//COMPONENTS
import ProfileInfomation from "./sections/ProfileInfomation";
import RequiredAuth from "@/components/RequiredAuth";

//SERVICES
import { useGetUserProfileApiQuery } from "@/services/userService";

//REDUX
import { updateProfile } from "@/redux/modules/profileSlice/profileSlice";
import { useCookieStorage } from "@/hooks";
import { useRouter } from "next/navigation";
import { CookieStorageKey, RouteType } from "@/constants";

function Profile() {
    //HOOKS
    const { t } = useTranslation();
    const { push } = useRouter();
    const dispatch = useAppDispatch();
    const { checkCookie } = useCookieStorage();

    //SERVICES
    const { data } = useGetUserProfileApiQuery();

    useEffect(() => {
        if(!Boolean(checkCookie(CookieStorageKey.TOKEN_SHARE))){
            push(RouteType.Login);
        }
    },[])

    useEffect(() => {
        dispatch(updateProfile({ ...data }));
    },[data])
    
    return ( 
        <RequiredAuth>
            <ProfileInfomation/>
        </RequiredAuth>
     );
}

export default Profile;