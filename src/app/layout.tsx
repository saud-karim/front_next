import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuildTools BS - متجر مواد البناء والأدوات",
  description: "متجر مواد البناء والأدوات الاحترافية - أجود أنواع الأسمنت والحديد والأدوات الكهربائية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
        {children}
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
