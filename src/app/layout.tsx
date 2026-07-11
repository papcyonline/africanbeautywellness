import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Africa Beauty & Wellness",
    template: "%s — Africa Beauty & Wellness",
  },
  description:
    "Building Africa's next beauty and wellness manufacturing giant. Manufacturing in Africa, powered by African ingredients. Join the vision.",
  keywords: [
    "African beauty manufacturing",
    "beauty and wellness",
    "Cameroon manufacturing",
    "African ingredients",
    "cosmetics manufacturing Africa",
    "contract manufacturing",
    "pan-African",
  ],
  openGraph: {
    type: "website",
    siteName: "Africa Beauty & Wellness",
    title: "Africa Beauty & Wellness",
    description:
      "Building Africa's next beauty and wellness manufacturing giant. Manufacturing in Africa, powered by African ingredients.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Beauty & Wellness",
    description:
      "Building Africa's next beauty and wellness manufacturing giant. Manufacturing in Africa, powered by African ingredients.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
