export interface CurrencyV2 {
    _id: string;
    name: string;
    code: string;
    symbol: string;
    country: string;
    decimals:number;
    format:string;
    isoNumber: number;
    subunit: string;
    subunitToUnit: number;
}