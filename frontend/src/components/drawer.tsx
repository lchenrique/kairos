'use client'

import { useDrawerStore } from "@/lib/stores/drawer-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export function Drawer() {
  const { isOpen, content: data, title, subtitle, content, close } = useDrawerStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {subtitle && (
            <SheetDescription>{subtitle}</SheetDescription>
          )}
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
