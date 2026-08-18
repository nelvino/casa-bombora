'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  duration?: number
  className?: string
}

export function Marquee({ children, duration = 25, className = '' }: MarqueeProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return (
      <div className={`flex flex-wrap items-center gap-8 ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max items-center gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
