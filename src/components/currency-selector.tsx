import useCurrencyStore from "@/lib/store/currency-store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Star } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCurrencies } from "@/lib/helpers/api/currencies/queries";
import { useAuth } from "@/lib/context/AuthContext";
import { CurrencyV2 } from "@/lib/types/currency";

export function CurrencySelector() {
  const { currencies, selectedCurrency, setSelectedCurrency, setCurrencies } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { token, user } = useAuth();
  const {isLoading, data} = useCurrencies(token);

  useEffect(() => {
    console.log(data);
    const payload: CurrencyV2[] = data as CurrencyV2[];
    setCurrencies(
      payload?.sort((a, b) => {
        const aIsFav = isFavCurrency(a) ? -1 : 1;
        const bIsFav = isFavCurrency(b) ? -1 : 1;
        return aIsFav - bIsFav || a.name.localeCompare(b.name);
      })
    );
    setValue(selectedCurrency?.code);
  }
  , [selectedCurrency, data]);


  function isFavCurrency(currency: CurrencyV2) {
    return user?.favCurrencies?.includes(currency._id);
  }
  
  const handleCurrencyChange = (selectedCode: string) => {
    const newCurrency = currencies?.find((currency) => currency.code === selectedCode);
    if (newCurrency) {
      setSelectedCurrency(newCurrency);
      setValue(selectedCode);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {isLoading ? (
            <div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
          ) : value ? (
            `${currencies?.find((currency) => currency.code === value)?.name} (${value})`
          ) : (
            "Selecciona una moneda"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        {isLoading ? (
          <div className="p-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Busca por Codigo de moneda" />
            <CommandList>
              <CommandEmpty>No se encontraron monedas.</CommandEmpty>
              <CommandGroup>
                {currencies?.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={(currentValue) => {
                      handleCurrencyChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {
                      isFavCurrency(currency) &&
                      <Star className="text-yellow-600 fill-yellow-500 w-[8px] height-[8px]" size={10} />  
                    }
                    {currency.name} ({currency.code})
                    
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}