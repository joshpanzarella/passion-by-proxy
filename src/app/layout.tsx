import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { band } from "@/data/band";
import { ZoetropeSplash } from "@/components/ZoetropeSplash";
import { SPLASH_KEY } from "@/data/zoetrope";
import { THEME_KEY } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(band.url),
  title: { default: band.name, template: `%s | ${band.name}` },
  description: band.tagline,
  keywords: [band.name, ...band.aliases],
  openGraph: {
    title: band.name,
    description: band.tagline,
    siteName: band.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Runs before first paint. data-js lets CSS hide scroll-reveal content
// (without JS it stays visible). Light is applied if chosen (everyone
// starts dark). A returning visitor this session, or one who asked
// for reduced motion, never sees the splash.
const splashGate = `document.documentElement.dataset.js="";try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light")document.documentElement.dataset.theme=t}catch(e){}try{if(sessionStorage.getItem("${SPLASH_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.splash="seen"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashGate }} />
        <noscript>
          <style>{".splash{display:none}"}</style>
        </noscript>
      </head>
      <body>
        <ZoetropeSplash />
        {children}
      </body>
    </html>
  );
}
