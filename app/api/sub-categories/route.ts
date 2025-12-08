import { NextResponse } from "next/server"

// Mock data storage
const subCategories = [
  { id: 1, name: "Headphones", categoryId: 1, createdAt: new Date().toISOString() },
  { id: 2, name: "Speakers", categoryId: 1, createdAt: new Date().toISOString() },
  { id: 3, name: "Men's Clothing", categoryId: 2, createdAt: new Date().toISOString() },
  { id: 4, name: "Women's Clothing", categoryId: 2, createdAt: new Date().toISOString() },
]

export async function GET() {
  return NextResponse.json(subCategories)
}
