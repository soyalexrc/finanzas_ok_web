import { CurrencyV2 } from "@/lib/types/currency"
import { useQuery } from "@tanstack/react-query"
import api, { endpoints } from ".."

export const useCurrencies = (token: string) => {
    return useQuery({
        queryKey: ["currencies"],
        enabled: !!token,
        queryFn: async (): Promise<CurrencyV2[]> => {
            const response = await api.post<CurrencyV2[]>(endpoints.currencies.list, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
    })
}