import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { defaultFieldColor } from '@/consts/colors';
import { getAllKeysExceptLabelKey } from '@/lib/helpers';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

// Define the type for the data
interface ChartData {
  name: string;
  [key: string]: string | number;  // Allow dynamic keys, representing the data for each area
}

interface Props {
  data: ChartData[]; // Use the specific ChartData type for data
  config: ChartConfig;
  colors: { [label: string]: string };
}

export const StackedAreaChart = ({ data, config, colors }: Props) => {
  const keys = getAllKeysExceptLabelKey(data, 'name');

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <AreaChart data={data}>
        <CartesianGrid />
        <XAxis dataKey={'name'} tickLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        {keys.map((dataKey) => (
          <Area
            type="monotone"
            key={dataKey}
            dataKey={dataKey}
            fillOpacity={0.1}
            fill={colors[dataKey] || defaultFieldColor}
            stroke={colors[dataKey] || defaultFieldColor}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
};
