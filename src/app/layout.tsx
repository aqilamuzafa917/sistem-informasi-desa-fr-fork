import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DesaProvider } from "@/contexts/DesaContext";
import { HomePageProvider } from "@/contexts/HomePageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Informasi Desa",
  description: "Sistem Informasi Desa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DesaProvider>
          <HomePageProvider>{children}</HomePageProvider>
        </DesaProvider>
      </body>
    </html>
  );
}
