import { cn } from '@/lib/utils/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

const variantClasses = {
  default: 'bg-blue-green text-alabaster hover:bg-blue-green/90',
  outline:
    'border-2 border-blue-green text-blue-green hover:bg-blue-green/10',
  ghost: 'text-blue-green hover:bg-blue-green/10',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  default: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-none font-sans font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-green focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
