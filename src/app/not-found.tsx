import Link from "next/link";
import { band } from "@/data/band";

export default function NotFound() {
  return (
    <main className="section not-found">
      {/* eslint-disable-next-line @next/next/no-img-element -- lettering art */}
      <img className="not-found__arc" src="/media/wordmark-arc.webp" alt={band.name} width={1000} height={525} />
      <h1 className="offset">lost the thread</h1>
      <p>
        <Link href="/">back to the start</Link>
      </p>
    </main>
  );
}
