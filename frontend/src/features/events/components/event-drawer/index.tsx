"use client"

import type { GetEvents200DataItem } from "@/lib/api/generated/model"

/** Compatibilidade para integrações antigas; o fluxo atual usa o Drawer global. */
export function EventDrawer(_props: { initialData?: GetEvents200DataItem; id?: string }) {
  return null
}
