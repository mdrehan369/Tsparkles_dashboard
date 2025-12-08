"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentOrders = [
  { id: "ORD-001", customer: "Emma Wilson", amount: "$1,234", status: "completed", date: "Jan 15, 2024" },
  { id: "ORD-002", customer: "James Smith", amount: "$892", status: "pending", date: "Jan 14, 2024" },
  { id: "ORD-003", customer: "Sarah Johnson", amount: "$2,456", status: "completed", date: "Jan 14, 2024" },
  { id: "ORD-004", customer: "Michael Brown", amount: "$654", status: "cancelled", date: "Jan 13, 2024" },
  { id: "ORD-005", customer: "Lisa Anderson", amount: "$1,890", status: "completed", date: "Jan 13, 2024" },
]

export function RecentOrders() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-light">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-light text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-light text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-light text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-light text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-light text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-light text-foreground">{order.id}</td>
                  <td className="py-3 px-4 font-light text-foreground">{order.customer}</td>
                  <td className="py-3 px-4 font-light text-foreground">{order.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusVariant(order.status)} className="font-light">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-light text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default"
    case "pending":
      return "secondary"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}
