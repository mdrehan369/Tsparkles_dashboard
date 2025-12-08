"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard/layout"

interface Category {
  id: number
  name: string
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })
      if (res.ok) {
        setNewCategory("")
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to add category:", error)
    }
  }

  const handleUpdateCategory = async (id: number) => {
    if (!editingName.trim()) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      })
      if (res.ok) {
        setEditingId(null)
        setEditingName("")
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to update category:", error)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage your product categories</p>
        </div>

        <Card className="border-sidebar-border">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle className="text-lg font-light">Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <Input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Plus size={16} />
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-sidebar-border">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle className="text-lg font-light">All Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground">No categories yet</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-sidebar-border hover:bg-sidebar/50 transition-colors"
                  >
                    {editingId === category.id ? (
                      <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-1" />
                    ) : (
                      <div>
                        <p className="font-light text-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingId === category.id ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateCategory(category.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(category.id)
                              setEditingName(category.name)
                            }}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
