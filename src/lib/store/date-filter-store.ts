import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Define the store's state and actions
interface DateFilterStoreState {
  year: number;
  setYear: (year: number) => void;
  reset: () => void;
}

const useDateFilterStore = create<DateFilterStoreState>()(
  persist(
    (set) => ({
        year: new Date().getFullYear(),
      setYear: (year: number) => set({ year }),
      reset: () => set({ year: new Date().getFullYear() }),
    }),
    {
      name: "date-filter-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useDateFilterStore;