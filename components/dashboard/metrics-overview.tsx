"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react"

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Orders",
    value: "1,234",
    change: "+8.2%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Customers",
    value: "892",
    change: "+4.3%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+0.5%",
    icon: TrendingUp,
    trend: "up",
  },
]

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-light text-muted-foreground">{metric.title}</CardTitle>
              <div className="p-2 bg-accent/10 rounded-md">
                <metric.icon className="w-4 h-4 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-light text-foreground">{metric.value}</div>
              <p className="text-xs text-chart-2 flex items-center gap-1">
                <span className="text-green-600">{metric.change}</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
