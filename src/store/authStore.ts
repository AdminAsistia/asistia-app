import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'client';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user: User) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  },
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
