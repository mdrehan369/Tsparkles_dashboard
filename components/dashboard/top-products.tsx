"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const topProducts = [
  { id: 1, name: "Premium Collection", sales: 234, revenue: "$8,234" },
  { id: 2, name: "Classic Series", sales: 189, revenue: "$6,523" },
  { id: 3, name: "Limited Edition", sales: 156, revenue: "$5,890" },
  { id: 4, name: "Seasonal Line", sales: 123, revenue: "$4,210" },
  { id: 5, name: "Basics Pack", sales: 98, revenue: "$2,940" },
]

export function TopProducts() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-light">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} orders</p>
              </div>
              <p className="text-sm font-light text-foreground ml-2">{product.revenue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
