"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useDrawerStore } from "@/lib/stores/drawer-store"

export function Drawer() {
  const { isOpen, title, subtitle, content, close } = useDrawerStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[480px]">
        <SheetHeader className="shrink-0 border-b px-6 py-4 pr-12 text-left">
          <SheetTitle>{title}</SheetTitle>
          {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-system">{content}</div>
      </SheetContent>
    </Sheet>
  )
}
