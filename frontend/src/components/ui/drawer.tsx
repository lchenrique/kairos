"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDrawerStore } from "@/lib/stores/drawer-store"

export function Drawer() {
  const { isOpen, title, subtitle, content, close } = useDrawerStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="w-full sm:max-w-[480px]">
        <ScrollArea className="h-full">
          <SheetHeader className="mb-6">
            <SheetTitle>{title}</SheetTitle>
            {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
          </SheetHeader>
          {content}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
