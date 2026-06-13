import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 客户端状态（鉴权）—— Zustand，与 UI 库无关。
 * persist 把 token 落地 localStorage，刷新不丢登录态。
 */
interface AuthState {
  token: string | null;
  user: { name: string } | null;
  login: (token: string, user: { name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth' },
  ),
);
