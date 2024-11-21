"use client"

import type { Category } from '@/types/xtream'

export class CategoryService {
  static async getCategories(serverId: number): Promise<Category[]> {
    const response = await fetch(`/api/db/categories?serverId=${serverId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    return response.json()
  }

  static async saveCategories(serverId: number, categories: Category[]): Promise<void> {
    const response = await fetch('/api/db/categories/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, categories })
    })

    if (!response.ok) {
      throw new Error('Failed to save categories')
    }
  }
}