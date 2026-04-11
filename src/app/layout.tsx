import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Fiesta Pagana | Experiencia Teatral & Comunidad",
  description: "Plataforma comunitaria para el show teatral 'La Fiesta Pagana'. Una experiencia oscura, elegante y mística.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
