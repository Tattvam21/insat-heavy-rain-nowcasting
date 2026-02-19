import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('glass h-4 w-full overflow-hidden rounded-full', className)}>
      <div
        className={cn('h-full transition-all duration-500 ease-out', indicatorClassName)}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}
