'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import useCurrencyStore from '@/lib/store/currency-store';
import useDateFilterStore from '@/lib/store/date-filter-store';
import { useMonthlyStatistics, useMonthlyTotalsByCategory, useStatisticsByCurrencyAndYear } from '@/lib/helpers/api/transactions/queries';
import TransactionsPerMonthChart from '@/components/transactions/TransactionsPerMonthChart';

export default function ResumenPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currency = useCurrencyStore((state) => state.selectedCurrency)
  const year =useDateFilterStore((state) => state.year)
  const { user, token } = useAuth();

  const {
    data: monthlyStatistics,
    isPending: monthlyStatisticsLoading,
    error: monthlyStatisticsError,
    refetch: recallMonthlyStatistics
} = useMonthlyStatistics(user._id, year, currency._id, token)
const {
    data: statisticsByCurrencyAndYear,
    isPending: statisticsByCurrencyAndYearLoading,
    error: statisticsByCurrencyAndYearError,
    refetch: recallStatisticsByCurrencyAndYear,
} = useStatisticsByCurrencyAndYear(user._id, year, currency._id, token)
const {
    data: monthlyTotalsByCategory,
    isPending: monthlyTotalsByCategoryLoading,
    error: monthlyTotalsByCategoryError,
    refetch: recallMonthlyTotalsByCategory,
} = useMonthlyTotalsByCategory(user._id, 'expense', currency._id, token)


  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resumen</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {
          !monthlyStatisticsLoading && monthlyStatistics?.length > 0 &&
          <div style={{height: 260, padding: 5, position: 'relative'}}>
              <p style={{textAlign: 'center', fontSize: 20}}>Gastado en {year}</p>
              <TransactionsPerMonthChart
                  onChartPressed={(data) => {
                      console.log('data', data)
                  }}
                  width={300}
                  data={monthlyStatistics}
                  currency={currency.code}
                  height={245}
              />
          </div>
          }
      </div>
    </motion.div>
  );
}
