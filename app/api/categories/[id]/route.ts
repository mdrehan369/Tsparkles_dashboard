import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
let categories = [
  { id: 1, name: "Electronics", createdAt: new Date().toISOString() },
  { id: 2, name: "Clothing", createdAt: new Date().toISOString() },
]

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name } = await request.json()

  const index = categories.findIndex((c) => c.id === Number.parseInt(id))
  if (index === -1) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  categories[index].name = name
  return NextResponse.json(categories[index])
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  categories = categories.filter((c) => c.id !== Number.parseInt(id))
  return NextResponse.json({ success: true })
}
