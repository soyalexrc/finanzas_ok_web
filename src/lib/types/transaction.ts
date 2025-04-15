export interface TransactionsByUserResponse {
    _id:         string;
    amount:      number;
    date:        Date;
    description: string;
    title:       string;
    documents:   any[];
    images:      any[];
    category:    Category;
    currency:    Currency;
}

export interface Category {
    _id:         string;
    icon:        string;
    type:        string;
    description: string;
    title:       string;
    user:        string;
    __v:         number;
}

export interface Currency {
    _id:           string;
    code:          string;
    symbol:        string;
    name:          string;
    decimals:      number;
    country:       string;
    isoNumber:     string;
    format:        string;
    subunit:       string;
    subunitToUnit: number;
    __v:           number;
}
