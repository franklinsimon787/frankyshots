export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">

          <a
            href="/"
            className="text-xl font-bold tracking-[0.25em] md:text-2xl"
          >
            FRANKYSHOTS
          </a>

          <a
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-gray-500 transition hover:text-white"
          >
            Back Home
          </a>

        </div>
      </header>


      {/* 404 CONTENT */}
      <section className="flex flex-1 items-center justify-center px-6 py-20">

        <div className="w-full max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
            Frankyshots
          </p>

          <h1 className="mt-6 text-[8rem] font-black leading-none tracking-tight md:text-[14rem]">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Page Not Found
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-500 md:text-lg">
            The page you are looking for does not exist or may have been
            moved to another location.
          </p>


          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <a
              href="/"
              className="border border-white bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-white"
            >
              Return Home
            </a>

            <a
              href="/projects"
              className="border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
            >
              Explore Projects
            </a>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <div className="font-semibold tracking-[0.25em] text-white">
            FRANKYSHOTS
          </div>

          <div>
            Wildlife • Conservation • Documentary
          </div>

        </div>

      </footer>

    </main>
  );
}