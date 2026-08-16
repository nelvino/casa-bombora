import { cn } from '@/lib/utils/cn'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'small' | 'large'
}

const sizeClasses = {
  default: 'max-w-6xl',
  small: 'max-w-3xl',
  large: 'max-w-7xl',
}

export function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
