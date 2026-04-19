"use client"

import Link from "next/link"

export default function AppError({ error, reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e0f0f] via-[#2a1717] to-[#4d1d1d] px-6 text-white">
      <section className="max-w-xl rounded-3xl border border-white/15 bg-black/20 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Error loading page</h1>
        <p className="mt-4 text-base leading-7 text-rose-100/90">
          An unexpected error occurred while loading this page. You can retry the request or go back home.
        </p>
        <p className="mt-4 text-xs text-rose-100/70 break-all">
          {error?.message || "Unknown error"}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}