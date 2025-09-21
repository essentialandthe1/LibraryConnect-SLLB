import create from "zustand";

export const useAuthStore = create((set) => ({
  user: null,           // { id, name, email, role }
  token: null,
  theme: "light",
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
  toggleTheme: () => set(state => ({ theme: state.theme === "light" ? "dark" : "light" }))
}));
