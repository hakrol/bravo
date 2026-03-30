import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { MainHeader } from "@/components/main-header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lonnsdata Norge",
  description: "Finn lonnsniva etter yrke, region og erfaring.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="no" className={manrope.className}>
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
