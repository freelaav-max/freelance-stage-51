import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer'
}

function Skeleton({
  className,
  variant = 'default',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    default: "animate-pulse rounded-md bg-muted",
    shimmer: "shimmer rounded-md bg-muted"
  }
  
  return (
    <div
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
}

export { Skeleton }
