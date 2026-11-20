import type { ComponentProps } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-white text-soil disabled:opacity-100', className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
