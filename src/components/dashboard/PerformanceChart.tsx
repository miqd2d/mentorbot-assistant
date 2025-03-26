
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

interface PerformanceData {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  className?: string;
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  const isMobile = useIsMobile();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Subject Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: isMobile ? 0 : 20,
                bottom: 20,
              }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="subject" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 80 : 50}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Legend />
              <ReferenceLine y={70} stroke="#777" strokeDasharray="3 3" />
              <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highest" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowest" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
