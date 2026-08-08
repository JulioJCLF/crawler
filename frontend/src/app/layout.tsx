import type { Metadata } from "next";
import { Inter, Saira_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CartProvider } from "@/providers/CartProvider";
import { FloatingCart } from "@/components/layout/FloatingCart";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const saira = Saira_Condensed({
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Plataforma de Catálogo de Equipamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${saira.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider defaultTheme="hunting" defaultLayout="sidebar">
          <CartProvider>
            {children}
            <FloatingCart />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
