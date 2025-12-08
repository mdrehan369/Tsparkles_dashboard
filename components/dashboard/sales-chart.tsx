"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan 1", sales: 4000, revenue: 2400 },
  { date: "Jan 8", sales: 3000, revenue: 1398 },
  { date: "Jan 15", sales: 2000, revenue: 9800 },
  { date: "Jan 22", sales: 2780, revenue: 3908 },
  { date: "Jan 29", sales: 1890, revenue: 4800 },
  { date: "Feb 5", sales: 2390, revenue: 3800 },
  { date: "Feb 12", sales: 3490, revenue: 4300 },
]

export function SalesChart() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-light">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--color-chart-1))"
              dot={false}
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--color-chart-2))"
              dot={false}
              strokeWidth={2}
              name="Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
