"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useDrawerStore } from "@/lib/stores/drawer-store"
import { GroupForm } from "./form"
import type { GetGroups200GroupsItem } from "@/lib/api/generated/model"

interface GroupDrawerProps {
  initialData?: GetGroups200GroupsItem
  id?: string
}

export function GroupDrawer({ initialData, id }: GroupDrawerProps) {
  const isOpen = useDrawerStore((state) => state.isOpen)
  const close = useDrawerStore((state) => state.close)

  return (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {initialData ? "Editar grupo" : "Novo grupo"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <GroupForm initialData={initialData} id={id} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
