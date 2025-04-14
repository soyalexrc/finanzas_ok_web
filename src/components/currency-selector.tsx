import useCurrencyStore from "@/lib/store/currency-store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCurrencies } from "@/lib/helpers/api/currencies/queries";
import { useAuth } from "@/lib/context/AuthContext";

export function CurrencySelector() {
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selectedCurrency?.code);
  }
  , [selectedCurrency]);


    const { token } = useAuth();
    const {isLoading} = useCurrencies(token);

  
  

  const handleCurrencyChange = (selectedCode: string) => {
    const newCurrency = currencies.find((currency) => currency.code === selectedCode);
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
            `${currencies.find((currency) => currency.code === value)?.name} (${value})`
          ) : (
            "Selecciona una moneda"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
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