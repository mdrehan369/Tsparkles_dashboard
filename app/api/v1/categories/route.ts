import { createCategory, deleteCategory, doesCategoryExists, getCategories } from "@/repositories/category"
import { doesSubcategoriesExists } from "@/repositories/subcategories"
import { CreateCategorySchema } from "@/zod/category"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsedBody = CreateCategorySchema.safeParse(body)
  if (parsedBody.error || !parsedBody.success) return NextResponse.json({ success: false, message: "Invalid body schema", error: parsedBody.error }, { status: 400 })

  const { name, subcategories } = parsedBody.data

  const categoryCnt = await doesCategoryExists(name)
  if (categoryCnt) return NextResponse.json({ success: false, message: "Category already exists with this name" }, { status: 400 })


  const subcategoryCnt = await doesSubcategoriesExists(subcategories || [])
  if (subcategoryCnt) return NextResponse.json({ success: false, message: "Category already exists with this name" }, { status: 400 })

  const newCategory = await createCategory(name, subcategories || [])

  return NextResponse.json(newCategory, { status: 201 })
}


export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1)
  const limit = Number(request.nextUrl.searchParams.get("limit") || 15)
  const search = request.nextUrl.searchParams.get("search") || ""

  const categories = await getCategories(page, limit, search)

  return NextResponse.json({ success: true, message: "Fetched!", data: categories })
}


export async function DELETE(request: NextRequest) {
  const { name } = await request.json()
  if (!name)
    return NextResponse.json({ success: false, message: "No name given" })

  await deleteCategory(name)
  return NextResponse.json({ success: true, message: "Deleted successfully!" })
}
