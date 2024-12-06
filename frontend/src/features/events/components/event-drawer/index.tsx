"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { EventForm } from "./form"
import type { GetEvents200EventsItem } from "@/lib/api/generated/model"

interface EventDrawerProps {
  initialData?: GetEvents200EventsItem
  id?: string
}

export function EventDrawer({ initialData, id }: EventDrawerProps) {
  const isOpen = useDrawerStore((state) => state.isOpen)
  const close = useDrawerStore((state) => state.close)

  return (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {initialData ? "Editar evento" : "Novo evento"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <EventForm initialData={initialData} id={id} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
