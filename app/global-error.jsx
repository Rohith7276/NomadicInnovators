"use client"

import Link from "next/link"

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6 text-white">
        <main className="max-w-xl rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Critical error</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Application error</h1>
          <p className="mt-4 text-base leading-7 text-slate-200">
            A critical error occurred while rendering the application shell.
          </p>
          <p className="mt-4 text-xs text-slate-300 break-all">
            {error?.message || "Unknown error"}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Return home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}