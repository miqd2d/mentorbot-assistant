
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface MarksDistribution {
  grade: string;
  count: number;
  percentage: number;
}

interface MarksDistributionChartProps {
  data: MarksDistribution[];
  className?: string;
}

export function MarksDistributionChart({ data, className }: MarksDistributionChartProps) {
  const isMobile = useIsMobile();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 80 : 100}
                dataKey="percentage"
                nameKey="grade"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
