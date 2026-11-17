import { create } from 'zustand'

import { createStorageAdapter } from '@/lib/zustand-persist'

const railCollapsedStorage = createStorageAdapter<boolean>(
  'reach_rail_collapsed'
)

type RailCollapsedState = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

/** Desktop mini rail, shared by the layout (`SidebarProvider`) and the shell controller. Expanded by default. */
export const useRailCollapsedStore = create<RailCollapsedState>((set) => ({
  collapsed: railCollapsedStorage.retrieve() === true,
  setCollapsed: (collapsed) => {
    railCollapsedStorage.save(collapsed)
    set({ collapsed })
  },
}))
