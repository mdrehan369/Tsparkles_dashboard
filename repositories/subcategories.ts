import { prisma } from "@/lib/prisma"


export async function doesSubcategoriesExists(subcategories: string[]) {
  const subcategoryCount = await prisma.subCategory.count({
    where: {
      name: {
        in: subcategories
      }
    }
  })

  if(subcategoryCount > 0) return true
  return false
}
