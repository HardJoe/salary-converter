import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SalaryScale — Global Salary Comparison' },
      {
        name: 'description',
        content:
          'Compare purchasing power and net income between 150+ countries with our high-fidelity relocation calculator.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen font-inter text-on-surface bg-background">
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm fixed top-0 w-full z-50">
      <div className="flex justify-between items-center h-16 px-gutter md:px-xxl max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-slate-900 font-manrope">
            SalaryScale
          </span>
          <nav className="hidden md:flex gap-6">
            <a
              href="#"
              className="font-manrope text-sm font-medium tracking-tight text-primary-container border-b-2 border-primary-container pb-1 cursor-pointer"
            >
              Calculators
            </a>
            <a
              href="#"
              className="font-manrope text-sm font-medium tracking-tight text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
            >
              Market Trends
            </a>
            <a
              href="#"
              className="font-manrope text-sm font-medium tracking-tight text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
            >
              Tax Guides
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="material-symbols-outlined text-slate-600 hover:bg-slate-100 transition-colors p-2 rounded-full text-[20px]">
            settings
          </button>
          <button className="material-symbols-outlined text-slate-600 hover:bg-slate-100 transition-colors p-2 rounded-full text-[20px]">
            help_outline
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-50 w-full py-12 border-t border-slate-200 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-gutter md:px-xxl max-w-container-max mx-auto">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 font-manrope">SalaryScale</span>
          <p className="font-manrope text-xs text-slate-500">
            © 2026 SalaryScale Financial. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="font-manrope text-xs text-slate-500 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-manrope text-xs text-slate-500 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="font-manrope text-xs text-slate-500 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  )
}
