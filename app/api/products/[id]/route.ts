import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
let products = [
  {
    id: 1,
    title: "Wireless Headphones",
    slug: "wireless-headphones",
    price: 99.99,
    comparePrice: 149.99,
    categoryId: 1,
    subCategoryId: 1,
    createdAt: new Date().toISOString(),
  },
]

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  products = products.filter((p) => p.id !== Number.parseInt(id))
  return NextResponse.json({ success: true })
}
