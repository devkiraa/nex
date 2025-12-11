import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "nex - Package Manager for Developer Tools",
    template: "%s | nex",
  },
  description: "The package manager for developer tools. Install, run, and share utilities with a single command.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${firaCode.variable} antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-300px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
