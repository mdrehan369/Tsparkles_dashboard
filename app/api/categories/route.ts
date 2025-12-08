import { type NextRequest, NextResponse } from "next/server"

// Mock data storage - replace with your database
const categories = [
  { id: 1, name: "Electronics", createdAt: new Date().toISOString() },
  { id: 2, name: "Clothing", createdAt: new Date().toISOString() },
]

let nextId = 3

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const { name } = await request.json()

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid category name" }, { status: 400 })
  }

  const newCategory = {
    id: nextId++,
    name,
    createdAt: new Date().toISOString(),
  }

  categories.push(newCategory)
  return NextResponse.json(newCategory, { status: 201 })
}
