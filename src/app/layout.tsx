import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "KABRA | Aceleração e Growth",
  description: "Da estratégia ao resultado fora da curva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[var(--color-bg-dark)] text-[#F2ECDA] antialiased">
        <Header />
        <main className="flex-grow pt-[84px] md:pt-[100px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
