import { create } from 'zustand';
import type { AuthState, UserProfile } from '../../types/auth';
import { loginWithGoogle, logoutUser } from '../../services/auth.service';

interface AuthStore extends AuthState {
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts true because we check session on load
  error: null,

  loginGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginWithGoogle();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  }
}));
