'use client'

import { Button } from '@/components/ui/Button'

interface ConfirmButtonProps {
  confirmText: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function ConfirmButton({
  confirmText,
  children,
  variant = 'ghost',
  size = 'sm',
  className,
}: ConfirmButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
    >
      {children}
    </Button>
  )
}
