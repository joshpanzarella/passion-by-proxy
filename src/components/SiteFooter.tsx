import Link from "next/link";
import { band } from "@/data/band";

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      {/* eslint-disable-next-line @next/next/no-img-element -- lettering art */}
      <img className="site-footer__wordmark" src="/media/wordmark-glitter.webp" alt={band.name} width={1100} height={142} loading="lazy" />
      <span>
        © {new Date().getFullYear()} {band.name} · <Link href="/lyrics">lyrics</Link>
      </span>
      <a href={home ? "#top" : "/"}>{home ? "back to top ↑" : "home ↑"}</a>
    </footer>
  );
}
