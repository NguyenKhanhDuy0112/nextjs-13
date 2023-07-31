import ProfileInfomation from "@/views/pages/Profile/sections/ProfileInfomation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pizza 4P'S Delivery - Profile",
    description: "The delivery web application of Pizza 4P's",
};

function ProfilePage() {

    return ( 
        <ProfileInfomation/>
     );
}

export default ProfilePage;