"use client"

import type { GetGroups200DataItem } from "@/lib/api/generated/model"

/** Compatibilidade para integrações antigas; o fluxo atual usa o Drawer global. */
export function GroupDrawer(_props: { initialData?: GetGroups200DataItem; id?: string }) {
  return null
}
