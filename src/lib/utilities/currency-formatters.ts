
// Brazilian currency config
export const moneyFormatter = Intl.NumberFormat("es-PE", {
    currency: "BRL",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});


type CurrencyData = {
    code: string;
    decimals: number;
};

export class CurrencyFormatters {
    static formatters: Record<string, Intl.NumberFormat> = {};

    static init(currencies: CurrencyData[]) {
        currencies.forEach((currency) => {
            this.formatters[currency.code] = new Intl.NumberFormat('es-PE', {
                style: "currency",
                currencyDisplay: "symbol",
                currencySign: "standard",
                currency: currency.code,
                minimumFractionDigits: currency.decimals,
                maximumFractionDigits: currency.decimals,
            });
        });
    }

    static format(code: string, value: number): string {
        const formatter = this.formatters[code];
        if (!formatter) throw new Error(`Formatter for ${code} not found.`);
        return formatter.format(value);
    }

    static getFormatter(code: string): Intl.NumberFormat {
        const formatter = this.formatters[code];
        if (!formatter) {
            console.warn(`Formatter for ${code} not found. Available:`, Object.keys(this.formatters));
            throw new Error(`Formatter for ${code} not found.`);
        }
        return formatter;
    }
}
