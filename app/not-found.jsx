import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 px-6 text-white">
      <section className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          The URL is invalid, or the resource is unavailable. Please try another page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
          >
            Return home
          </Link>
          <Link
            href="/States"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Browse states
          </Link>
        </div>
      </section>
    </main>
  )
}