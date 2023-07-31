import Register from "@/views/pages/Register";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pizza 4P'S Delivery - Register",
    description: "The delivery web application of Pizza 4P's",
};

function RegisterPage() {

    return ( 
        <section>
            <Register/>
        </section>
     );
}

export default RegisterPage;