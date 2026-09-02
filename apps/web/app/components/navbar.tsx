"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* TOP NAVBAR */}
        <div className="flex items-center justify-between py-6">

          {/* LOGO */}
          <a
  href="/"
  onClick={closeMenu}
  className="flex items-center"
>
  <img
    src="/images/logo.png"
    alt="Frankyshots"
    className="h-12 w-auto object-contain"
  />
</a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm md:flex">

            <a href="/" className="transition hover:text-gray-400">
              Home
            </a>

            <a href="/wildlife" className="transition hover:text-gray-400">
              Wildlife
            </a>

            <a
              href="/documentaries"
              className="transition hover:text-gray-400"
            >
              Documentaries
            </a>

            <a
              href="/photography"
              className="transition hover:text-gray-400"
            >
              Photography
            </a>

            <a href="/projects" className="transition hover:text-gray-400">
              Projects
            </a>

            <a href="/about" className="transition hover:text-gray-400">
              About
            </a>

            <a href="/contact" className="transition hover:text-gray-400">
              Contact
            </a>

          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-xl md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "☰"}
          </button>

        </div>


        {/* MOBILE MENU */}
        {menuOpen && (
          <nav className="border-t border-white/10 py-5 md:hidden">

            <div className="flex flex-col">

              <a
                href="/"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Home
              </a>

              <a
                href="/wildlife"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Wildlife
              </a>

              <a
                href="/documentaries"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Documentaries
              </a>

              <a
                href="/photography"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Photography
              </a>

              <a
                href="/projects"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Projects
              </a>

              <a
                href="/about"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                About
              </a>

              <a
                href="/contact"
                onClick={closeMenu}
                className="py-4 text-sm uppercase tracking-widest transition hover:text-gray-400"
              >
                Contact
              </a>

            </div>

          </nav>
        )}

      </div>
    </header>
  );
}