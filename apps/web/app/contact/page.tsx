export default function Contact() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            Frankyshots / Contact
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight md:text-8xl lg:text-9xl">
            LET&apos;S
            <br />
            CONNECT
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            For documentary projects, wildlife documentation, photography,
            collaborations and other professional enquiries.
          </p>

        </div>

      </section>


      {/* CONTACT INFORMATION */}
      <section className="border-y border-white/10 px-6 py-24 md:px-10">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Get in Touch
            </p>

            <h2 className="mt-5 text-4xl font-bold md:text-6xl">
              Contact Frankyshots
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-500">
              Whether you are interested in wildlife filmmaking,
              photography, documentation or collaboration, you can get in
              touch with Frankyshots.
            </p>

          </div>


          <div className="border-l border-white/10 pl-8">

            <div className="border-b border-white/10 pb-8">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                Production
              </p>

              <p className="mt-3 text-xl font-semibold">
                Frankyshots Production
              </p>

            </div>


            <div className="border-b border-white/10 py-8">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                Director
              </p>

              <p className="mt-3 text-xl font-semibold">
                Franklin Anthony Simon
              </p>

            </div>


            <div className="pt-8">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                Email
              </p>

              {/* Replace this email with your actual professional email */}
              <a
                href="mailto:frankyshotsproduction@email.com"
                className="mt-3 inline-block text-xl font-semibold transition hover:text-gray-400"
              >
                frankyshotsproduction@email.com
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ENQUIRY TYPES */}
      <section className="bg-neutral-950 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Enquiries
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            What Can We Work On?
          </h2>


          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              "Documentary Projects",
              "Wildlife Photography",
              "Wildlife Documentation",
              "Collaborations",
            ].map((item, index) => (

              <div
                key={item}
                className="border border-white/10 p-8 transition duration-300 hover:bg-white hover:text-black"
              >

                <p className="text-xs tracking-[0.3em] opacity-40">
                  0{index + 1}
                </p>

                <h3 className="mt-14 text-2xl font-bold">
                  {item}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* EMAIL CTA */}
      <section className="px-6 py-28 md:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Start a Conversation
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            Have a Project in Mind?
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-500">
            Tell us about your project, idea or collaboration and get in
            touch with Frankyshots.
          </p>

          {/* Replace email here too */}
          <a
            href="mailto:frankyshotsproduction@email.com"
            className="mt-9 inline-flex border border-white px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Send an Email
          </a>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <div className="font-semibold tracking-[0.2em] text-white">
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