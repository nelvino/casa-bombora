'use client'

import Link from 'next/link'

interface BackLinkProps {
  href: string
  label: string
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-gunmetal/70 transition-colors hover:text-blue-green"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:-translate-x-0.5"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>Back to {label}</span>
    </Link>
  )
}
