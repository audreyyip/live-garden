import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition active:scale-95 disabled:opacity-50",
  {
    variants: {
      variant: { default: "bg-teal text-white", soft: "bg-sky/80 text-soil", ghost: "bg-transparent" },
      size: { default: "h-12 px-8 text-xl", icon: "size-14 text-3xl" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
