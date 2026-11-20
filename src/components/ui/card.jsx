import { cn } from "@/lib/utils"

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-[32px] bg-cream p-6 text-soil", className)} {...props} />
)
