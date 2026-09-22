import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section not-found">
      <h1 className="offset">lost the thread</h1>
      <p>
        <Link href="/">back to the start</Link>
      </p>
    </main>
  );
}
