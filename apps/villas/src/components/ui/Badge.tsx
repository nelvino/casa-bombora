import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'blue' | 'lion' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gunmetal/10 text-gunmetal',
  blue: 'bg-blue-green/10 text-blue-green',
  lion: 'bg-lion/20 text-brown',
  outline: 'border border-gunmetal/20 text-gunmetal/80',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
