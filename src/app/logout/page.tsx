"use client"
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/modules/authSlice/authSlice";
import type { Metadata } from "next";
import { useEffect } from "react";

export const metadata: Metadata = {
    title: "Pizza 4P'S Delivery",
    description: "The delivery web application of Pizza 4P's",
};

function LogoutPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(logout());
    },[])

    return ( 
        <section>
            
        </section>
     );
}

export default LogoutPage;