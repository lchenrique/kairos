import { create } from "zustand"
import { GroupsState, GroupFilters, Group } from "@/types/group"

const initialState: GroupsState = {
  view: "grid",
  filters: {},
  groups: [],
  loading: false,
  error: null,
}

export const useGroupsStore = create<GroupsState>((set) => ({
  ...initialState,
  setView: (view: "grid" | "table") => set({ view }),
  setFilters: (filters: GroupFilters) => set({ filters }),
  setGroups: (groups: Group[]) => set({ groups }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  reset: () => set(initialState),
}))
