import { create } from 'zustand'

interface UIStore {
  isDarkMode: boolean
  setDarkMode: (isDark: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isDarkMode: false,
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
}))
