"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import useCurrencyStore from "@/lib/store/currency-store";
import useDateFilterStore from "@/lib/store/date-filter-store";
import {
  useMonthlyStatistics,
  useMonthlyTotalsByCategory,
  useStatisticsByCurrencyAndYear,
} from "@/lib/helpers/api/transactions/queries";
import TransactionsPerMonthChart from "@/components/transactions/TransactionsPerMonthChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ResumenPage() {
  const currency = useCurrencyStore((state) => state.selectedCurrency);
  const year = useDateFilterStore((state) => state.year);
  const { user, token } = useAuth();

  const {
    data: monthlyStatistics,
    isPending: monthlyStatisticsLoading,
  } = useMonthlyStatistics(user._id, year, currency._id, token);
  const {
    data: statisticsByCurrencyAndYear,
    isPending: statisticsByCurrencyAndYearLoading,
  } = useStatisticsByCurrencyAndYear(user._id, year, currency._id, token);
  const {
    data: monthlyTotalsByCategory,
    isPending: monthlyTotalsByCategoryLoading,
  } = useMonthlyTotalsByCategory(user._id, "expense", currency._id, token);

  return (
    <motion.div
      className="min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resumen</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* First Column */}
          {!monthlyStatisticsLoading && monthlyStatistics?.length > 0 ? (
            <div className="col-span-12 md:col-span-5">
              <TransactionsPerMonthChart
                onChartPressed={(data) => {
                  console.log("data", data);
                }}
                data={monthlyStatistics}
              />
            </div>
          ) : (
            <div className="col-span-12 md:col-span-5 flex items-center justify-center">
              <div className="w-72 h-72 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          )}

          {
            !statisticsByCurrencyAndYearLoading && statisticsByCurrencyAndYear ? (
            <div className="col-span-12 md:col-span-7 max-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle>Gastado este mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{currency.symbol} {statisticsByCurrencyAndYear?.totalCurrentMonth}</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle>Gastado el mes pasado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{currency.symbol} {statisticsByCurrencyAndYear?.totalLastMonth}</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle>Gastado la semana pasada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{currency.symbol} {statisticsByCurrencyAndYear?.totalLastWeek}</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle>Gastado durante {year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{currency.symbol} {statisticsByCurrencyAndYear?.totalSpentOnYear}</p>
                </CardContent>
              </Card>
            </div>
            ) : (
            <div className="col-span-12 md:col-span-7 max-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            </div>
            )
          }

         
        </div>

        {!monthlyTotalsByCategoryLoading && monthlyTotalsByCategory?.length > 0 ? (
          <Card className="mt-5 max-h-[400px] bg-white shadow-md rounded-lg ">
            <CardHeader>
              <CardTitle>Gastado este mes por categoria</CardTitle>
              <CardDescription className="uppercase">
                {format(new Date(), "MMMM", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Swiper
                loop
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                centeredSlides={true}
                slidesPerView={3}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Autoplay, Navigation]}
                className="mySwiper"
              >
                {monthlyTotalsByCategory.map((item: any) => (
                  <SwiperSlide key={item.category.title} className="mb-10">
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <p className="text-4xl">{item.category.icon}</p>
                      <h2 className="text-lg font-semibold">
                        {item.category.title}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Gastado: {item.value} {currency.code}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-5 max-h-[400px] bg-gray-200 animate-pulse rounded-lg h-64"></div>
        )}
      </div>
    </motion.div>
  );
}
