'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { name: 'Villas', href: '/#villas' },
  { name: 'Home', href: '/' },
]

interface HeaderProps {
  isAdmin?: boolean
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function Header({ isAdmin }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isScrolled = true

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-[height] duration-300',
          isScrolled ? 'h-24' : 'h-16',
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className={cn(
              'mx-auto flex w-full items-center justify-between px-4 transition-all duration-300',
              isScrolled
                ? 'mt-6 h-14 max-w-5xl rounded-full border border-white/20 bg-white/70 px-4 shadow-lg backdrop-blur-xl backdrop-saturate-150'
                : 'h-16',
            )}
          >
            <Link
              href="/"
              className={cn(
                'group flex items-baseline gap-2 truncate font-serif text-lg transition-colors md:text-xl lg:text-2xl',
                isScrolled ? 'text-gunmetal' : 'text-alabaster',
              )}
            >
              <span className="font-semibold">Casa Bombora</span>
              <span className="text-blue-green transition-colors group-hover:text-blue-green/80">
                Villas
              </span>
            </Link>

            {/* Desktop nav */}
            <ul
              className={cn(
                'hidden items-center gap-6 text-sm font-medium md:flex',
                isScrolled ? 'text-gunmetal/80' : 'text-alabaster/90',
              )}
            >
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      'transition-colors',
                      isScrolled
                        ? 'hover:text-blue-green'
                        : 'hover:text-blue-green',
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="rounded-full bg-blue-green/10 px-3 py-1 text-blue-green transition-colors hover:bg-blue-green/20"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={cn(
                'relative p-2 md:hidden',
                isScrolled ? 'text-gunmetal' : 'text-alabaster',
              )}
            >
              <div
                className={cn(
                  'absolute inset-0 rounded-full bg-gunmetal/5 transition-opacity',
                  menuOpen ? 'opacity-100' : 'opacity-0'
                )}
              />
              <div className="relative">
                {menuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gunmetal/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full bg-alabaster shadow-2xl transition-transform duration-300 ease-out sm:max-w-md md:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="font-serif text-xl text-gunmetal"
            >
              Casa Bombora <span className="text-blue-green">Villas</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-gunmetal transition-colors hover:bg-gunmetal/5"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="rounded-lg px-4 py-3 font-serif text-2xl text-gunmetal transition-colors hover:bg-gunmetal/5 hover:text-blue-green"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className="rounded-lg px-4 py-3 font-serif text-2xl text-blue-green transition-colors hover:bg-blue-green/10"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="mt-auto">
            <p className="text-sm text-gunmetal/60">
              Book private villas in Uluwatu, Bali.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
