const work = [
  {
    number: "01",
    title: "Wildlife Documentation",
    description:
      "Field-based documentation of wildlife, birds, reptiles and other forms of biodiversity through photography and observation.",
  },
  {
    number: "02",
    title: "Documentary Filmmaking",
    description:
      "Documentary films that explore wildlife, conservation, history and stories connected to the landscape.",
  },
  {
    number: "03",
    title: "Photography",
    description:
      "Wildlife and nature photography created through patience, field observation and time spent in natural habitats.",
  },
  {
    number: "04",
    title: "Research & Storytelling",
    description:
      "Research-driven storytelling that combines field documentation with visual and historical narratives.",
  },
];

const projects = [
  {
    year: "2025",
    title: "Eyes in the Wild",
    type: "Wildlife Documentary",
  },
  {
    year: "2026",
    title: "The Unbeatable Castle",
    type: "Historical Documentary",
  },
  {
    year: "2024",
    title: "Wildlife of Burhanpur District",
    type: "Wildlife Documentation / Magazine",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden">

        <div className="absolute inset-0 bg-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            About Frankyshots
          </p>

          <h1 className="mt-6 max-w-6xl text-6xl font-black leading-[0.9] tracking-tight md:text-8xl lg:text-9xl">
            WILDLIFE.
            <br />
            STORIES.
            <br />
            DOCUMENTATION.
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-gray-300 md:text-lg">
            An independent platform focused on wildlife documentation,
            photography, conservation and documentary storytelling.
          </p>

        </div>

      </section>


      {/* INTRODUCTION */}
      <section className="border-b border-white/10 px-6 py-24 md:px-10">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Who We Are
            </p>

            <h2 className="mt-5 text-4xl font-bold md:text-6xl">
              About Frankyshots
            </h2>

          </div>


          <div>

            <p className="text-lg leading-9 text-gray-400">
              Frankyshots is an independent wildlife and documentary
              production platform focused on observing, documenting and
              communicating stories from the natural and historical world.
            </p>

            <p className="mt-7 text-lg leading-9 text-gray-400">
              The work combines wildlife photography, field documentation,
              documentary filmmaking and research-driven storytelling.
              The aim is to create visual records that connect people with
              wildlife, landscapes and history.
            </p>

            <p className="mt-7 text-lg leading-9 text-gray-400">
              From documenting species in the field to producing
              documentaries and conservation-focused projects, Frankyshots
              brings together observation, research and visual storytelling
              under one platform.
            </p>

          </div>

        </div>

      </section>


      {/* WHAT WE DO */}
      <section className="border-b border-white/10 bg-neutral-950 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            What We Do
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            Work in the Field
          </h2>


          <div className="mt-14 grid gap-5 md:grid-cols-2">

            {work.map((item) => (

              <article
                key={item.number}
                className="border border-white/10 p-8 transition duration-300 hover:bg-white hover:text-black md:p-10"
              >

                <p className="text-xs tracking-[0.3em] opacity-40">
                  {item.number}
                </p>

                <h3 className="mt-12 text-3xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 opacity-50">
                  {item.description}
                </p>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* APPROACH */}
      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Our Approach
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            Observe. Document. Tell the Story.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-500">
            Wildlife documentation begins with observation. Understanding
            the landscape, spending time in the field and recording what
            is actually encountered are central to the work.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-gray-500">
            Photography and filmmaking then become tools for preserving
            those observations and presenting them as stories that can be
            understood beyond the field.
          </p>

        </div>

      </section>


      {/* SELECTED PROJECTS */}
      <section className="border-y border-white/10 bg-neutral-950 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                Selected Work
              </p>

              <h2 className="mt-5 text-4xl font-bold md:text-6xl">
                Projects
              </h2>

            </div>

            <a
              href="/projects"
              className="text-xs uppercase tracking-[0.25em] text-gray-500 transition hover:text-white"
            >
              View All Projects →
            </a>

          </div>


          <div className="mt-14 border-t border-white/10">

            {projects.map((project) => (

              <div
                key={project.title}
                className="grid gap-4 border-b border-white/10 py-8 md:grid-cols-[120px_1fr_300px] md:items-center"
              >

                <p className="text-sm text-gray-600">
                  {project.year}
                </p>

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500 md:text-right">
                  {project.type}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* PRODUCTION */}
      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Production
            </p>

            <h2 className="mt-5 text-4xl font-bold md:text-6xl">
              Frankyshots Production
            </h2>

          </div>

          <div>

            <p className="text-lg leading-9 text-gray-500">
              Frankyshots Production develops wildlife, historical and
              documentary projects from research and field documentation
              through filmmaking and final presentation.
            </p>

            <p className="mt-7 text-lg leading-9 text-gray-500">
              The production work focuses on authentic documentation,
              visual storytelling and creating films and projects that
              preserve the stories of wildlife, people, places and history.
            </p>

          </div>

        </div>

      </section>


      {/* CREATOR */}
      <section className="border-t border-white/10 bg-neutral-950 px-6 py-24 md:px-10">

        <div className="mx-auto max-w-5xl">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Founder / Director
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            Franklin Anthony Simon
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-9 text-gray-400">
            Wildlife documentation, photography and documentary filmmaking
            form the foundation of the work behind Frankyshots.
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-9 text-gray-400">
            Through field-based observation and visual storytelling,
            projects are developed around wildlife, conservation and
            historical subjects.
          </p>


          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="/photography"
              className="border border-white px-7 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            >
              Photography
            </a>

            <a
              href="/documentaries"
              className="border border-white/30 px-7 py-4 text-xs uppercase tracking-[0.2em] transition hover:border-white"
            >
              Documentaries
            </a>

          </div>

        </div>

      </section>


      {/* CONTACT CTA */}
      <section className="px-6 py-28 md:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Get in Touch
          </p>

          <h2 className="mt-5 text-4xl font-bold md:text-6xl">
            Have a Story to Tell?
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-500">
            For documentary projects, wildlife documentation, photography
            and collaborations, get in touch with Frankyshots.
          </p>

          <a
            href="/contact"
            className="mt-9 inline-flex border border-white px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Contact Frankyshots
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