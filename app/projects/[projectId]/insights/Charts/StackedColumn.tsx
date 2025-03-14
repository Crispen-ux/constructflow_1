import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { grayFieldColor } from '@/consts/colors';
import { getAllKeysExceptLabelKey } from '@/lib/helpers';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

// Define the type for the data
interface ChartData {
  name: string;
  [key: string]: string | number;  // Allow dynamic keys, representing the data for each bar
}

interface Props {
  data: ChartData[]; // Use the specific ChartData type for data
  config: ChartConfig;
  colors: { [label: string]: string };
}

export const StackedColumnChart = ({ data, config, colors }: Props) => {
  const keys = getAllKeysExceptLabelKey(data, 'name');

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid />
        <XAxis dataKey={'name'} tickLine={false} tickMargin={10} />
        <YAxis />

        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />

        {keys.map((dataKey) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            name={dataKey}
            fillOpacity={0.1}
            fill={colors[dataKey] || grayFieldColor}
            stroke={colors[dataKey] || grayFieldColor}
            strokeWidth={2}
            stackId="a"
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};
