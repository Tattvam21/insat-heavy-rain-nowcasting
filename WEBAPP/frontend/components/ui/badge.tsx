import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  success: 'bg-green-500/20 text-green-300 border-green-400/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  danger: 'bg-red-500/20 text-red-300 border-red-400/30',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
