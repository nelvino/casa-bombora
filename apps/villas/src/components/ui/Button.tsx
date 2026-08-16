import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'default' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-green text-alabaster shadow-sm hover:bg-blue-green/90 focus:ring-blue-green',
  secondary:
    'bg-gunmetal text-alabaster shadow-sm hover:bg-gunmetal/90 focus:ring-gunmetal',
  outline:
    'border border-alabaster text-alabaster bg-transparent hover:bg-alabaster/10 focus:ring-alabaster',
  ghost: 'text-blue-green hover:bg-blue-green/10 focus:ring-blue-green',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  default: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'default',
  asChild,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-lg font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
    })
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
