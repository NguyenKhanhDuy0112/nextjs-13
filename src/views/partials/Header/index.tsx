"use client";

//HOOKS
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { usePathname } from "next/navigation";
import { RouteType } from "@/constants";

function Header() {
    const pathname = usePathname()

    return ( 
        <header className="header">
            {
                (pathname === '/' || pathname === (RouteType.Login as string) || pathname === (RouteType.Register as string))
                ? '' :
                <HeaderMobile/>
            }
            <HeaderDesktop/>
        </header>
     );
}

export default Header;