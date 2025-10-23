import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = { accessToken: string | null; refreshToken: string | null; adminUsername: string | null; };
type Actions = { 
    setAccessToken: (t: string | null) => void; 
    setRefreshToken: (t: string | null) => void; 
    setAdminUsername: (e: string | null) => void; 
    setAuth: (p: Partial<State>) => void; 
    reset: () => void; };
type Store = State & Actions;

export const useAuthStore = create<Store>()(
  persist<Store>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      adminUsername: null,
      setAccessToken: (t) => set({ accessToken: t }),
      setRefreshToken: (t) => set({ refreshToken: t }),
      setAdminUsername: (e) => set({ adminUsername: e }),
      setAuth: (p) => set(p),
      reset: () => set({ accessToken: null, refreshToken: null, adminUsername: null }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ((s: Store) => ({
        accessToken: s.accessToken,
        adminUsername: s.adminUsername,
      })) as any,
    }
  )
);
