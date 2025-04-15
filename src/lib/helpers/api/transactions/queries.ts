import {useQuery} from '@tanstack/react-query';
import api, { endpoints } from '..';
import {TransactionsByUserResponse} from "@/lib/types/transaction";

type YearlyExpensesByCategoryPayload = {
    userId: string;
    year: number;
    currency: string;
    token: string;
}

type RawTransactionsPayload = {
    userId: string;
    dateFrom: string;
    dateTo: string,
    searchTerm: string;
    token: string;
}

export interface Section {
    title: {
        title: string;
        totals: any[]
    };
    data: any[];
}

interface MonthlyTotalsByCategoryPayload  {
    userId: string;
    categoryType: string;
    currencyId: string;
    token: string;
}


const fetchYearlyExpensesByCategory = async ({userId, year, currency, token}: YearlyExpensesByCategoryPayload) => {
    const response = await api.post(endpoints.transactions.getYearlyExpensesByCategory, {
        userId, year, currency
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to fetch yearly expenses by category');
    }

    return response.data;
};

const fetchMonthlyStatistics = async ({userId, year, currency, token}: YearlyExpensesByCategoryPayload) => {
    const response = await api.post(endpoints.transactions.getMonthlyStatistics, {
        userId, year, currency
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to fetch yearly expenses by month');
    }

    return response.data;
};

const fetchMonthlyTotalsByCategory = async ({userId, categoryType, currencyId, token}: MonthlyTotalsByCategoryPayload) => {
    const response = await api.post(endpoints.transactions.getMonthlyTotalsByCategory, {
        userId, categoryType, currencyId
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    if (response.status !== 200) {
        throw new Error('Failed to fetch yearly expenses by month');
    }

    return response.data;
}


const fetchStatisticsByCurrencyAndYear = async ({
                                                    userId,
                                                    year,
                                                    currency,
                                                    token
                                                }: YearlyExpensesByCategoryPayload) => {
    const response = await api.post(endpoints.transactions.getStatisticsByCurrencyAndYear, {
        userId, year, currency
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to fetch yearly expenses by month');
    }

    return response.data;
};

const fetchRawTransactions = async ({userId, dateFrom, dateTo, searchTerm, token}: RawTransactionsPayload) => {
    const response = await api.post(endpoints.transactions.listByUser, {
        userId, dateFrom, dateTo, searchTerm
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to fetch transactions ');
    }

    return response.data;
};

const fetchTransactionGroupedByDay = async ({userId, dateFrom, dateTo, searchTerm, token}: RawTransactionsPayload): Promise<TransactionsByUserResponse[]> => {
    const response = await api.post<TransactionsByUserResponse[]>(endpoints.transactions.listByUser, {
        userId, dateFrom, dateTo, searchTerm
    }, {
        headers: {authorization: `Bearer ${token}`}
    })

    return  response.data;
};


export const useYearlyExpensesByCategory = (userId: string, year: number, currency: string, token: string) => {
    return useQuery({
        enabled: !!token && !!userId,
        queryKey: ['yearlyExpensesByCategory', userId, year, currency, token],
        queryFn: () => fetchYearlyExpensesByCategory({userId, year, currency, token}),
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
};

export const useMonthlyStatistics = (userId: string, year: number, currency: string, token: string,) => {
    return useQuery({
        queryKey: ['monthlyStatistics', userId, year, currency, token],
        enabled: !!token && !!userId,
        queryFn: () => fetchMonthlyStatistics({userId, year, currency, token}),
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
};

export const useStatisticsByCurrencyAndYear = (userId: string, year: number, currency: string, token: string,) => {
    return useQuery({
        queryKey: ['statisticsByCurrencyAndYear', userId, year, currency, token],
        enabled: !!token && !!userId,
        queryFn: () => fetchStatisticsByCurrencyAndYear({userId, year, currency, token}),
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
};

export const useRawTransactions = (userId: string, dateFrom: string, dateTo: string, searchTerm: string, token: string,) => {
    return useQuery({
        enabled: !!token && !!userId && !!searchTerm || (!!dateFrom && !!dateTo), // Run only if searchTerm exists OR both dateFrom & dateTo exist
        queryKey: ['rawTransactions', userId, dateFrom, searchTerm, token],
        queryFn: () => fetchRawTransactions({userId, dateFrom, dateTo, searchTerm, token}),
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
};


export const useTransactionsGroupedByDay = (userId: string, dateFrom: string, dateTo: string, searchTerm: string, token: string,) => {
    console.log('token', token);
    console.log('userId', userId);
    return useQuery({
        enabled: !!token && !!userId || (!!dateFrom && !!dateTo && !!searchTerm), // Run only if searchTerm exists OR both dateFrom & dateTo exist
        queryKey: ['transactionsGroupedByDay', userId, dateFrom, searchTerm, token],
        queryFn: () => fetchTransactionGroupedByDay({userId, dateFrom, dateTo, searchTerm, token}),
        // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
};

export const useMonthlyTotalsByCategory = (userId: string, categoryType: string, currencyId: string, token: string,) => {
    return useQuery({
        enabled: !!token && !!userId,
        queryKey: ['monthlyTotalsByCategory', userId, currencyId, categoryType, token],
        queryFn: () => fetchMonthlyTotalsByCategory({userId, categoryType, currencyId, token}),
        staleTime: 1000 * 60 * 60 * 14, // Cache for 24 Hours
    });
}
