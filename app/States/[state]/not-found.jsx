import Link from "next/link"

export default function StateNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <section className="w-full max-w-lg rounded-3xl border border-[#640303]/15 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#640303]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-[#031a2c]">State data not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          The state you requested does not exist, could not be loaded, or an error occurred while fetching it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-[#031a2c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#12314a]"
          >
            Go home
          </Link>
          
        </div>
      </section>
    </main>
  )
}