"use client"

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Trash2, Edit2, Plus } from "lucide-react";
import TransactionModal, { TransactionForm } from "../components/TransactionModal";
import { CurrencyContext } from '../components/SideBar';

type Transaction = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  category_id?: string;
};

type Category = {
  id: string;
  name: string;
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TransactionForm>({
    name: '',
    type: 'income',
    amount: '',
    category: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { currency } = useContext(CurrencyContext);

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);
      // Removed unused handleTypeChange function
  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const json = await res.json();
    if (json.data) setTransactions(json.data);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const json = await res.json();
    if (json.data) setCategories(json.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // Update Transaction
  const handleUpdate = async (id: string, updated: Partial<Transaction>) => {
    await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    fetchTransactions();
  };

  // Delete Transaction
  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button className="flex items-center gap-2 self-start sm:self-auto" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className={`
                      border-b border-gray-200 dark:border-gray-700
                      transition-colors
                      ${t.type === 'income' ? 'bg-green-50 dark:bg-green-950' : ''}
                      ${t.type === 'expense' ? 'bg-red-50 dark:bg-red-950' : ''}
                      hover:bg-green-100 dark:hover:bg-green-900
                      ${t.type === 'expense' ? 'hover:bg-red-100 dark:hover:bg-red-900' : ''}
                    `}
                  >
                    <td className="px-4 py-2">{t.name}</td>
                    <td className="px-4 py-2 capitalize">{t.type}</td>
                    <td className="px-4 py-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(t.amount)}</td>
                    <td className="px-4 py-2">
                      {categories.find(cat => cat.id === t.category_id)?.name || ''}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => {
                        setIsEditing(true);
                        setEditId(t.id);
                        setForm({
                          name: t.name,
                          type: t.type,
                          amount: String(t.amount),
                          category: t.category_id || '',
                        });
                        setModalOpen(true);
                      }}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="destructive" onClick={() => { setDeleteId(t.id); setConfirmOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Modal for Add/Edit Transaction */}
      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setIsEditing(false); setEditId(null); }}
        onSubmit={isEditing ? (form) => {
          if (editId) {
            handleUpdate(editId, {
              name: form.name,
              type: form.type as 'income' | 'expense',
              amount: Number(form.amount),
              category_id: form.category || undefined,
            });
          }
          setModalOpen(false);
          setForm({ name: '', type: 'income', amount: '', category: '' });
          setIsEditing(false);
          setEditId(null);
        } : async (form) => {
          await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              type: form.type,
              amount: Number(form.amount),
              category_id: form.category || null,
            }),
          });
          setModalOpen(false);
          setForm({ name: '', type: 'income', amount: '', category: '' });
          fetchTransactions();
        }}
        categories={categories}
        form={form}
        setForm={setForm}
        isEditing={isEditing}
      />
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-0">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 relative mx-2 sm:mx-0">
            <button className="absolute top-3 right-3 text-xl" onClick={() => setConfirmOpen(false)}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this transaction?</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { if (deleteId) handleDelete(deleteId); setConfirmOpen(false); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 