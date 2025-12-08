import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const products = [
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

let nextId = 2

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, slug, price, comparePrice, categoryId, subCategoryId } = body

  if (!title || !slug || !price || !categoryId || !subCategoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const newProduct = {
    id: nextId++,
    title,
    slug,
    price,
    comparePrice: comparePrice || null,
    categoryId,
    subCategoryId,
    createdAt: new Date().toISOString(),
  }

  products.push(newProduct)
  return NextResponse.json(newProduct, { status: 201 })
}
