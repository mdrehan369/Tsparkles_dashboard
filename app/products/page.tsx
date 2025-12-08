"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard/layout"

interface Category {
  id: number
  name: string
}

interface SubCategory {
  id: number
  name: string
  categoryId: number
}

interface Product {
  id: number
  title: string
  slug: string
  price: number
  comparePrice?: number
  categoryId: number
  subCategoryId: number
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    subCategoryId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subCategories.filter((sub) => sub.categoryId === Number.parseInt(formData.categoryId))
      if (filtered.length > 0 && !filtered.some((s) => s.id === Number.parseInt(formData.subCategoryId || "0"))) {
        setFormData((prev) => ({ ...prev, subCategoryId: "" }))
      }
    }
  }, [formData.categoryId, subCategories])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/sub-categories"),
      ])

      setProducts(await productsRes.json())
      setCategories(await categoriesRes.json())
      setSubCategories(await subCategoriesRes.json())
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          comparePrice: formData.comparePrice ? Number.parseFloat(formData.comparePrice) : null,
          categoryId: Number.parseInt(formData.categoryId),
          subCategoryId: Number.parseInt(formData.subCategoryId),
        }),
      })

      if (res.ok) {
        setFormData({
          title: "",
          slug: "",
          price: "",
          comparePrice: "",
          categoryId: "",
          subCategoryId: "",
        })
        setShowForm(false)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to add product:", error)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name
  const getSubCategoryName = (id: number) => subCategories.find((s) => s.id === id)?.name

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage your product catalog</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={16} />
            Add Product
          </Button>
        </div>

        {showForm && (
          <Card className="border-sidebar-border">
            <CardHeader className="border-b border-sidebar-border">
              <CardTitle className="text-lg font-light">Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <Input
                  placeholder="Product title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Product slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Compare price (optional)"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                  />
                </div>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.subCategoryId}
                  onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories
                      .filter((sub) => sub.categoryId === Number.parseInt(formData.categoryId || "0"))
                      .map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Add Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-sidebar-border">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle className="text-lg font-light">All Products</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">No products yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sidebar-border">
                      <th className="text-left py-3 px-4 font-light text-foreground">Title</th>
                      <th className="text-left py-3 px-4 font-light text-foreground">Price</th>
                      <th className="text-left py-3 px-4 font-light text-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-light text-foreground">Sub-Category</th>
                      <th className="text-right py-3 px-4 font-light text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-sidebar-border hover:bg-sidebar/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-light text-foreground">{product.title}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </td>
                        <td className="py-3 px-4 font-light text-foreground">
                          ${product.price.toFixed(2)}
                          {product.comparePrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${product.comparePrice.toFixed(2)}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-light text-foreground">{getCategoryName(product.categoryId)}</td>
                        <td className="py-3 px-4 font-light text-foreground">
                          {getSubCategoryName(product.subCategoryId)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit2 size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
