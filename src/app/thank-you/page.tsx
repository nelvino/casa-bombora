"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [seconds, setSeconds] = useState(5);

  const name = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return (params.get("name") || "").trim();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      window.location.href = "/";
    }
  }, [seconds]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6 bg-alabaster/10">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm max-w-lg w-full text-center">
        <div className="font-serif text-2xl mb-2">
          <span className="text-lion">CASA</span> <span className="text-blue-green">bombora</span>
        </div>
        <h1 className="font-serif text-3xl mb-2">Thank you{ name ? ` ${name}` : "" }!</h1>
        <p className="text-gunmetal/70 mb-6">We've received your message and will get back to you shortly.</p>
        <div className="mb-4 text-gunmetal/60">Redirecting in {seconds}s…</div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-gunmetal text-white hover:bg-gunmetal/90"
          aria-label="Back to homepage"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
