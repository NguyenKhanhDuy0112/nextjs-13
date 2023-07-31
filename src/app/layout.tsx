import { Providers } from "@/redux/Providers";
import type { Metadata } from "next";
import "../views/styles/index.scss";

export const metadata: Metadata = {
  title: "Pizza 4P'S Delivery - Login",
  description: "The delivery web application of Pizza 4P's",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
