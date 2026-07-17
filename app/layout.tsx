import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "FLOPs — Master your money. Not your stress.",
  description:
    "FLOPs transforms your financial data into personalized insights, smarter budgets, and AI-powered recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable, instrumentSerif.variable, "font-sans", geist.variable)}
    >
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

