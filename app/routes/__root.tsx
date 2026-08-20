import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import "../styles.css";
import { useTheme } from "../hooks/useTheme";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SalaryScale — Global Salary Comparison" },
      {
        name: "description",
        content:
          "Compare purchasing power and net income between 150+ countries with our high-fidelity relocation calculator.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){const t=localStorage.getItem('theme');const d=t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')})()`,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  useTheme();

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen font-inter text-on-surface bg-background text-on-surface-dark transition-colors duration-200">
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { isDark, toggle, mounted } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant shadow-sm fixed top-0 w-full z-50 transition-colors duration-200">
      <div className="flex justify-between items-center h-16 px-gutter md:px-xxl max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-on-surface font-manrope">
            SalaryScale
          </span>
          <nav className="hidden md:flex gap-6">
            <a
              href="#"
              className="font-manrope text-sm font-medium tracking-tight text-primary border-b-2 border-primary-container pb-1 cursor-pointer"
            >
              Calculators
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isClient && mounted && (
            <button
              onClick={toggle}
              className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full text-[20px]"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "light_mode" : "dark_mode"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant w-full py-12 mt-auto transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-gutter md:px-xxl max-w-container-max mx-auto">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-on-surface font-manrope">
            SalaryScale
          </span>
          <p className="font-manrope text-xs text-on-surface-variant">
            © 2026 Jonathan Hartman. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
