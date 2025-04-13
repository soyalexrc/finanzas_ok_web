import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CurrencyV2 } from "../types/currency";

const DEFAULT_CURRENCY_ID_USD = "67b60a53743e50fa9d4b5fc2";

// Define the store's state and actions
interface CurrencyStoreState {
  currencies: CurrencyV2[];
  selectedCurrency: CurrencyV2;
  setCurrencies: (currencies: CurrencyV2[]) => void;
  setSelectedCurrency: (currency: CurrencyV2) => void;
  reset: () => void;
}

const useCurrencyStore = create<CurrencyStoreState>()(
  persist(
    (set) => ({
      currencies: [],
      selectedCurrency: {
        symbol: "$",
        _id: DEFAULT_CURRENCY_ID_USD,
        code: "USD",
        country: "United States",
        format: "#,##0.00 ¤",
        name: "United States Dollar",
        decimals: 2,
        isoNumber: 0,
        subunit: "Cent",
        subunitToUnit: 100,
      },
      setCurrencies: (currencies: CurrencyV2[]) => set({ currencies }),
      setSelectedCurrency: (currency: CurrencyV2) => set({ selectedCurrency: currency }),
      reset: () =>
        set({
          currencies: [],
          selectedCurrency: {
            symbol: "$",
            _id: DEFAULT_CURRENCY_ID_USD,
            code: "USD",
            country: "United States",
            format: "#,##0.00 ¤",
            name: "United States Dollar",
            decimals: 2,
            isoNumber: 0,
            subunit: "Cent",
            subunitToUnit: 100,
          },
        }),
    }),
    {
      name: "currency-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCurrencyStore;