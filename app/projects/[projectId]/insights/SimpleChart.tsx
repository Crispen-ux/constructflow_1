'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

interface Props {
  data: ChartData[];  // Use the ChartData type here instead of 'any[]'
  colors: { [label: string]: string };
}

export const SimpleChart = ({ data, colors }: Props) => {
  return (
    <div className="h-[400px] w-full border rounded-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill={colors['count']} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
