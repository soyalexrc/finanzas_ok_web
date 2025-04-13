"use client";

import { ResponsiveContainer, Tooltip, XAxis, LineChart, Line, Dot, Legend, BarChart, Bar } from "recharts";
import { useState } from "react";

// Define the props for the component
type TransactionsPerMonthChartProps = {
  width: number;
  height: number;
  data: any[];
  onChartPressed: (data: any) => void;
  currency: string;
};

const customFontStyle = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  color: "#333",
};

export default function TransactionsPerMonthChart({
  width,
  height,
  data,
  currency,
}: TransactionsPerMonthChartProps) {


  return (
    <div
      style={{ width, height, overflow: "hidden", userSelect: "none" }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{ overflow: "hidden" }}
      >
        <BarChart data={data}>
          <XAxis
            dataKey="nameShort"
            interval={0}
            angle={-45}
            textAnchor="end"
            style={customFontStyle}
          />
          <Bar dataKey="expense" fill="#FF5733" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}