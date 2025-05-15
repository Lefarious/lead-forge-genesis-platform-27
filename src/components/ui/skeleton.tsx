
import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * 
 * A UI component that displays a placeholder loading state
 * before content has loaded. Uses a pulsing animation to indicate loading.
 * 
 * Example usage:
 * <Skeleton className="h-12 w-12 rounded-full" /> // Avatar skeleton
 * <Skeleton className="h-4 w-[250px]" /> // Text line skeleton
 * 
 * @param className - Additional CSS classes
 * @param props - All other standard HTML div attributes
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
