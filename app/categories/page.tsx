"use client"

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2, Plus } from "lucide-react";
import { CurrencyContext } from '../components/SideBar';

type Category = {
  id: string;
  name: string;
  budget?: number;
  spent?: number;
  budget_limit?: number;
};

type Transaction = {
  id: string;
  amount: number;
  category_id: string;
  type: string;
};

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    budget: '',
    spent: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currency } = useContext(CurrencyContext);

  // Fetch categories from API
  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const json = await res.json();
    if (json.data) setCategories(json.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  // Add this useEffect after fetching categories
  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch('/api/transactions');
      const json = await res.json();
      if (json.data) setTransactions(json.data);
    };
    fetchTransactions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add Category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          budget_limit: Number(form.budget),
          spent: form.spent ? Number(form.spent) : 0,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add category.');
      } else {
        setModalOpen(false);
        setForm({ name: '', budget: '', spent: '' });
        fetchCategories();
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  // Update Category
  const handleUpdate = async (id: string, updated: Partial<Category>) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      fetchCategories();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  // Delete Category
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button className="flex items-center gap-2 self-start sm:self-auto" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>
      {/* Modal for Add Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-0">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 relative mx-2 sm:mx-0">
            <button className="absolute top-3 right-3 text-xl" onClick={() => { setModalOpen(false); setIsEditing(false); setEditId(null); }}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
            <form className="space-y-4" onSubmit={isEditing ? (e) => {
              e.preventDefault();
              handleUpdate(editId as string, {
                name: form.name,
                budget_limit: Number(form.budget),
                spent: form.spent ? Number(form.spent) : 0,
              });
              setModalOpen(false);
              setForm({ name: '', budget: '', spent: '' });
              setIsEditing(false);
              setEditId(null);
            } : handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spent <span className="text-xs text-muted-foreground">(optional)</span></label>
                <input
                  type="number"
                  name="spent"
                  value={form.spent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 0"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => { setModalOpen(false); setIsEditing(false); setEditId(null); }}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((cat: Category) => {
              const spent = transactions
                .filter((tx: Transaction) => String(tx.category_id) === String(cat.id) && tx.type === 'expense')
                .reduce((sum: number, tx: Transaction) => sum + Math.abs(Number(tx.amount)), 0);
              const percent = (cat.budget_limit && spent) ? Math.min((spent / cat.budget_limit) * 100, 100) : 0;
              return (
                <div key={cat.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{cat.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Budget: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cat.budget_limit ?? 0)} | Spent: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(spent ?? 0)}
                    </div>
                    <Progress value={percent} className="h-2 mt-2" />
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button size="icon" variant="ghost" onClick={() => {
                      setIsEditing(true);
                      setEditId(cat.id);
                      setForm({
                        name: cat.name,
                        budget: cat.budget_limit?.toString() || cat.budget?.toString() || '',
                        spent: cat.spent?.toString() || '',
                      });
                      setModalOpen(true);
                    }}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => { setDeleteId(cat.id); setConfirmOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-0">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 relative mx-2 sm:mx-0">
            <button className="absolute top-3 right-3 text-xl" onClick={() => setConfirmOpen(false)}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this category?</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { handleDelete(deleteId as string); setConfirmOpen(false); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 