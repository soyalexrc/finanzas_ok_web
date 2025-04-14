"use client";

import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useDateFilterStore from "@/lib/store/date-filter-store";
// Define the props for the component
type TransactionsPerMonthChartProps = {
  data: any[];
  onChartPressed: (data: any) => void;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function TransactionsPerMonthChart({
  data,
}: TransactionsPerMonthChartProps) {
  const year = useDateFilterStore((state) => state.year);

  return (
    <Card className="max-h-[400px] bg-white shadow-md rounded-lg ">
      <CardHeader>
        <CardTitle>Resumen anual</CardTitle>
        <CardDescription>{year}</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="w-full max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="nameShort"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="expense" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="income" fill="var(--color-mobile)" radius={4} />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
