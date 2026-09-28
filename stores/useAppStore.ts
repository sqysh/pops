import { create } from 'zustand'

interface AppState {
  navigationDrawerOpen: boolean
  openNavigationDrawer: () => void
  closeNavigationDrawer: () => void
  toggleNavigationDrawer: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  navigationDrawerOpen: false,
  openNavigationDrawer: () => set({ navigationDrawerOpen: true }),
  closeNavigationDrawer: () => set({ navigationDrawerOpen: false }),
  toggleNavigationDrawer: () => set((state) => ({ navigationDrawerOpen: !state.navigationDrawerOpen }))
}))
