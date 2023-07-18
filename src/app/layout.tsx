import Providers from "@components/Providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Social Media Chat App",
  description: "Chat App with great performance",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}  className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
