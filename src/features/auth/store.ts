import { create } from "zustand";

type State = {
  accessToken: string | null;
  refreshToken: string | null;
  adminUsername: string | null;
};
type Actions = {
  setAccessToken: (t: string | null) => void;
  setRefreshToken: (t: string | null) => void;
  setAdminUsername: (e: string | null) => void;
};
export const useAuthStore = create<State & Actions>((set) => ({
  accessToken: null,
  refreshToken: null,
  adminUsername: null,
  setAccessToken: (at) => set({ accessToken: at }),
  setRefreshToken: (rt) => set({ refreshToken: rt }),
  setAdminUsername: (e) => set({ adminUsername: e }),
}));
