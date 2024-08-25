import { create } from "zustand";
interface User {
  email: string;
  role: string;
  username: string;
}
interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
export default useUserStore;
