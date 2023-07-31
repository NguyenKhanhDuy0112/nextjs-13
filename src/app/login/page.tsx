import LoginPage from "@/views/pages/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pizza 4P'S Delivery - Login",
    description: "The delivery web application of Pizza 4P's",
};

function Login() {
    return ( 
        <section>
            <LoginPage/>
        </section>
     );
}

export default Login;