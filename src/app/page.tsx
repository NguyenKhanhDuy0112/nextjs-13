import LoginPage from "@/views/pages/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pizza 4P'S Delivery - Login",
  description: "The delivery web application of Pizza 4P's",
};

export default function MainPage() {

  return (
    <main>
      <LoginPage />
    </main>
  );
}
