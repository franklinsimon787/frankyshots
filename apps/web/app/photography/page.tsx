"use client";

import { useEffect, useMemo, useState } from "react";

type SpeciesImage = {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  summary: string;
  featuredImage: string;
  isFeatured: boolean;
  status: string;
};

type GalleryItem = SpeciesImage & {
  size: "small" | "medium" | "large" | "wide";
  delay: number;
  duration: number;
};

export default function Photography() {
  const [images, setImages] = useState<SpeciesImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] =
    useState<SpeciesImage | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [shuffleKey, setShuffleKey] = useState(0);

  /*
  ------------------------------------------------
  LOAD DATABASE IMAGES
  ------------------------------------------------
  */

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/species", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load photography.");
        }

        const data: SpeciesImage[] = await response.json();

        /*
        Only keep records having an image.
        */

        const validImages = data.filter(
          (item) =>
            item.featuredImage &&
            item.featuredImage.trim() !== ""
        );

        /*
        Randomly shuffle complete database
        */

        const shuffled = [...validImages].sort(
          () => Math.random() - 0.5
        );

        /*
        Pick maximum 30 images.
        */

        setImages(shuffled.slice(0, 30));
      } catch (err) {
        console.error(err);
        setError("Unable to load photography archive.");
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [shuffleKey]);

  /*
  ------------------------------------------------
  OPTIONAL AUTO SHUFFLE
  ------------------------------------------------

  Every 45 seconds the gallery gets a new
  random selection.
  */

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffleKey((value) => value + 1);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  /*
  ------------------------------------------------
  RANDOM GALLERY LAYOUT
  ------------------------------------------------
  */

  const gallery = useMemo<GalleryItem[]>(() => {
    return images.map((image, index) => {
      const random = Math.random();

      let size: GalleryItem["size"] = "medium";

      if (index === 0) {
        size = "large";
      } else if (random > 0.82) {
        size = "large";
      } else if (random > 0.65) {
        size = "wide";
      } else if (random < 0.25) {
        size = "small";
      }

      return {
        ...image,
        size,
        delay: Math.random() * 1.5,
        duration: 5 + Math.random() * 4,
      };
    });
  }, [images]);

  /*
  ------------------------------------------------
  OPEN IMAGE
  ------------------------------------------------
  */

  function openImage(image: SpeciesImage, index: number) {
    setSelectedImage(image);
    setSelectedIndex(index);
  }

  /*
  ------------------------------------------------
  NEXT IMAGE
  ------------------------------------------------
  */

  function nextImage() {
    if (images.length === 0) return;

    const nextIndex =
      (selectedIndex + 1) % images.length;

    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  }

  /*
  ------------------------------------------------
  PREVIOUS IMAGE
  ------------------------------------------------
  */

  function previousImage() {
    if (images.length === 0) return;

    const previousIndex =
      (selectedIndex - 1 + images.length) %
      images.length;

    setSelectedIndex(previousIndex);
    setSelectedImage(images[previousIndex]);
  }

  /*
  ------------------------------------------------
  KEYBOARD CONTROLS
  ------------------------------------------------
  */

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (!selectedImage) return;

      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [selectedImage, selectedIndex, images]);

  /*
  ------------------------------------------------
  LOADING
  ------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">

        <section className="flex min-h-[80vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-8 h-10 w-10 animate-spin rounded-full border border-white/20 border-t-white" />

            <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
              Loading Archive
            </p>

            <p className="mt-4 text-2xl font-light text-white">
              Through the Lens
            </p>

          </div>

        </section>

      </main>
    );
  }

  /*
  ------------------------------------------------
  ERROR
  ------------------------------------------------
  */

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">

        <section className="flex min-h-[80vh] items-center justify-center px-6">

          <div className="max-w-lg text-center">

            <p className="text-xs uppercase tracking-[0.4em] text-red-400">
              Photography Archive
            </p>

            <h1 className="mt-5 text-4xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-5 text-gray-500">
              {error}
            </p>

            <button
              onClick={() =>
                setShuffleKey((value) => value + 1)
              }
              className="mt-8 border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
            >
              Try Again
            </button>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-[85vh] items-end overflow-hidden">

        {/* Background glow */}

        <div className="absolute inset-0">

          <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-white/[0.025] blur-[120px]" />

          <div className="absolute bottom-[10%] right-[10%] h-[350px] w-[350px] rounded-full bg-white/[0.02] blur-[120px]" />

        </div>


        {/* Animated grid */}

        <div className="absolute inset-0 opacity-[0.025]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>


        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:px-10">

          <p className="animate-[fadeUp_1s_ease-out] text-xs uppercase tracking-[0.55em] text-gray-500">
            Frankyshots / Photography
          </p>

          <h1 className="mt-6 max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.05em] md:text-8xl lg:text-[10rem]">

            THROUGH
            <br />

            <span className="text-gray-500">
              THE LENS
            </span>

          </h1>

          <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <p className="max-w-xl text-base leading-8 text-gray-400 md:text-lg">
              A living photographic archive of wildlife,
              birds and field observations captured through
              the lens of Frankyshots.
            </p>


            <div className="flex items-center gap-5">

              <div className="h-px w-16 bg-white/30" />

              <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
                {images.length} Selected Frames
              </p>

            </div>

          </div>

        </div>


        {/* Bottom scroll indicator */}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">

          <div className="flex flex-col items-center gap-3">

            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-600">
              Scroll
            </span>

            <div className="h-10 w-px overflow-hidden bg-white/10">

              <div className="h-1/2 w-full animate-[scrollLine_2s_ease-in-out_infinite] bg-white/50" />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="border-y border-white/10 bg-neutral-950">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 py-16 md:flex-row md:items-center md:px-10">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-gray-600">
              Visual Archive
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Moments in the Wild
            </h2>

          </div>


          <div className="max-w-xl">

            <p className="leading-8 text-gray-500">
              Every photograph is selected directly from the
              Frankyshots wildlife database. The gallery changes
              automatically, bringing different moments from the
              archive into view.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          RANDOM COLLAGE
      ===================================================== */}

      <section className="px-4 py-16 md:px-8 md:py-24">

        <div className="mx-auto max-w-[1600px]">

          {/* Gallery Header */}

          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">
                Random Selection
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                The Collection
              </h2>

            </div>


            <button
              onClick={() =>
                setShuffleKey((value) => value + 1)
              }
              className="group flex w-fit items-center gap-4 border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.25em] text-gray-400 transition hover:border-white hover:bg-white hover:text-black"
            >

              <span>
                Shuffle Archive
              </span>

              <span className="text-lg transition-transform duration-500 group-hover:rotate-180">
                ↻
              </span>

            </button>

          </div>


          {/* COLLAGE */}

          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4 lg:auto-rows-[240px]">

            {gallery.map((item, index) => (

              <article
                key={`${item.id}-${shuffleKey}`}
                onClick={() =>
                  openImage(item, index)
                }
                className={`
                  group relative cursor-pointer overflow-hidden
                  bg-neutral-950
                  ${item.size === "large"
                    ? "col-span-2 row-span-2"
                    : ""}
                  ${item.size === "wide"
                    ? "col-span-2"
                    : ""}
                  ${item.size === "medium"
                    ? "col-span-1 row-span-1"
                    : ""}
                  ${item.size === "small"
                    ? "col-span-1"
                    : ""}
                `}
                style={{
                  animation: `galleryFloat ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
                }}
              >

                {/* IMAGE */}

                <img
                  src={item.featuredImage}
                  alt={item.name}
                  loading={index < 6 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.12]"
                />


                {/* Dark gradient */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />


                {/* Border */}

                <div className="absolute inset-0 border border-white/0 transition-all duration-700 group-hover:border-white/40" />


                {/* Number */}

                <div className="absolute left-5 top-5">

                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 transition-colors duration-500 group-hover:text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>


                {/* Info */}

                <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-5 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 md:p-7">

                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold md:text-2xl">
                    {item.name}
                  </h3>

                  {item.location && (
                    <p className="mt-1 text-xs text-white/50">
                      {item.location}
                    </p>
                  )}

                </div>


                {/* Hover icon */}

                <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                  +
                </div>

              </article>

            ))}

          </div>


          {/* Archive count */}

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
              Randomly selected from wildlife archive
            </p>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
              {images.length} / 30 Frames
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="relative overflow-hidden border-y border-white/10 bg-neutral-950">

        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>


        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-600">
            Behind the Photograph
          </p>

          <h2 className="mt-7 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Every frame is a record
            <br />
            of something witnessed.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl leading-8 text-gray-500">
            Photography at Frankyshots is connected to field
            observation, wildlife documentation and conservation.
            These images are not just photographs — they are part
            of a growing record of the natural world.
          </p>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-16 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">
                Frankyshots
              </p>

              <h2 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
                KEEP
                <br />
                EXPLORING.
              </h2>

            </div>


            <p className="max-w-md leading-8 text-gray-500">
              Explore more wildlife documentation,
              species records and stories from the field.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      {selectedImage && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-10"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          {/* CLOSE */}

          <button
            onClick={() =>
              setSelectedImage(null)
            }
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:bg-white hover:text-black"
          >
            ×
          </button>


          {/* PREVIOUS */}

          <button
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white backdrop-blur-sm transition hover:bg-white hover:text-black md:left-8"
          >
            ←
          </button>


          {/* NEXT */}

          <button
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white backdrop-blur-sm transition hover:bg-white hover:text-black md:right-8"
          >
            →
          </button>


          {/* IMAGE */}

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="relative max-h-[78vh] overflow-hidden">

              <img
                src={selectedImage.featuredImage}
                alt={selectedImage.name}
                className="max-h-[78vh] max-w-[90vw] object-contain"
              />

            </div>


            {/* DETAILS */}

            <div className="mt-5 w-full max-w-3xl">

              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                    {selectedImage.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                    {selectedImage.name}
                  </h3>

                </div>


                <div className="text-right">

                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
                    Frame
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                    {images.length}
                  </p>

                </div>

              </div>


              {selectedImage.location && (
                <p className="mt-2 text-sm text-gray-500">
                  {selectedImage.location}
                </p>
              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 px-6 py-12 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">

          <div>

            <div className="font-bold tracking-[0.25em]">
              FRANKYSHOTS
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Wildlife • Conservation • Documentary
            </p>

          </div>


          <div className="text-sm text-gray-600">
            © 2026 Frankyshots. All rights reserved.
          </div>

        </div>

      </footer>


      {/* =====================================================
          ANIMATION STYLES
      ===================================================== */}

      <style jsx>{`

        @keyframes galleryFloat {
          0% {
            transform: translateY(0px);
          }

          100% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }

          50% {
            transform: translateY(100%);
          }

          100% {
            transform: translateY(250%);
          }
        }

      `}</style>

    </main>
  );
}