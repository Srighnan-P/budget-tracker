'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import TransactionModal from "../components/TransactionModal";
import { CurrencyContext } from '../components/SideBar';
import { FullPageLoading } from '@/components/ui/loading';

type Transaction = {
  id: number;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  category_id?: number;
  created_at?: string;
  date?: string;
};

type Category = {
  id: number;
  name: string;
  budget_limit?: number;
  spent?: number;
  // Add more specific fields as needed
};

type Monthly = {
  [key: string]: { month: string; income: number; expenses: number };
};

type CategoryBudget = {
  name: string;
  spent: number;
  budget: number;
  color: string;
};

type TransactionForm = {
  name: string;
  type: 'income' | 'expense';
  amount: string;
  category: string;
};

type ModalCategory = {
  id: string;
  name: string;
};

const Dashboard = () => {
  const { data: session, status } = useSession()
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TransactionForm>({
    name: '',
    type: 'income',
    amount: '',
    category: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expenses: number }[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const txRes = await fetch('/api/transactions');
      const catRes = await fetch('/api/categories');
      const txJson = await txRes.json();
      const catJson = await catRes.json();
      const txs = txJson.data || [];
      const cats = (catJson.data || []).map((cat: unknown) => {
        const c = cat as { id: string | number; name: string };
        return { ...c, id: String(c.id) };
      });
      setTransactions(txs);
      setCategories(cats);
      // Calculate summary
      let totalIncome = 0, totalExpenses = 0;
      const monthly: Monthly = {};
      (txs as Transaction[]).forEach((tx: Transaction) => {
        if (tx.type === 'income') totalIncome += Number(tx.amount);
        if (tx.type === 'expense') totalExpenses += Number(tx.amount);
        const month = new Date(tx.created_at || tx.date || '').toLocaleString('default', { month: 'short' });
        if (!monthly[month]) monthly[month] = { month, income: 0, expenses: 0 };
        if (tx.type === 'income') monthly[month].income += Number(tx.amount);
        if (tx.type === 'expense') monthly[month].expenses += Number(tx.amount);
      });
      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setBalance(totalIncome - totalExpenses);
      setMonthlyData(Object.values(monthly));
      // Category budgets
      const catBudgets = (cats as Category[]).map((cat: Category) => {
        const spent = (txs as Transaction[])
          .filter((tx: Transaction) => String(tx.category_id) === String(cat.id) && tx.type === 'expense')
          .reduce((sum: number, tx: Transaction) => sum + Number(tx.amount), 0);
        return {
          name: cat.name,
          spent,
          budget: cat.budget_limit || 0,
          color: '#ef4444', // You can map colors as needed
        };
      });
      setCategoryBudgets(catBudgets);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Show loading while checking auth
  if (status === 'loading' || loading) {
    return <FullPageLoading text="Loading your dashboard..." />
  }

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your finances.
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(income)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(expenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Current Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Available to spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 px-2 sm:px-0">
        {/* Income vs Expenses Chart */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              Monthly comparison of your income and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto min-h-[200px]">
              <div className="min-w-[400px] sm:min-w-0">
                <div className="block sm:hidden">
                  <ResponsiveContainer width={400} height={260}>
                    <BarChart data={monthlyData} barCategoryGap={24}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: 'var(--color-muted-foreground)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: 'var(--color-muted-foreground)' }} width={40} />
                      <Tooltip 
                        contentStyle={{ borderRadius: 12, background: 'var(--color-card)', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value))}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                      />
                      <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="hidden sm:block">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyData} barCategoryGap={24}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: 'var(--color-muted-foreground)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: 'var(--color-muted-foreground)' }} width={40} />
                      <Tooltip 
                        contentStyle={{ borderRadius: 12, background: 'var(--color-card)', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value))}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                      />
                      <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />Income</div>
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500" />Expenses</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction: Transaction) => {
                // Find the category name from categories array using category_id
                const categoryObj = categories.find((cat: Category) => cat.id === transaction.category_id);
                const categoryName = categoryObj ? categoryObj.name : '';
                return (
                  <div key={transaction.id} className="flex items-center space-x-4 border-b border-muted last:border-b-0 py-2">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center gap-2">
                        {transaction.name}
                        {categoryName && (
                          <span className="inline-block bg-blue-600 px-2 py-0.5 rounded-full font-medium text-xs text-white">
                            {categoryName}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          const rawDate = transaction.date || transaction.created_at || '';
                          if (!rawDate) return '';
                          const d = new Date(rawDate);
                          if (isNaN(d.getTime())) return rawDate;
                          return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        })()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Math.abs(transaction.amount))}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>
            Track your spending against budget limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryBudgets.map((category: CategoryBudget) => {
              const percentage = (category.spent / category.budget) * 100
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(category.spent)} / {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(category.budget)}
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      '--progress-background': category.color,
                    } as React.CSSProperties}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(category.budget - category.spent)} remaining</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add Transaction */}
      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setIsEditing(false); setEditId(null); }}
        onSubmit={async (form: TransactionForm) => {
          if (isEditing && editId) {
            await fetch(`/api/transactions/${editId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: form.name,
                type: form.type,
                amount: Number(form.amount),
                category_id: form.category || null,
              }),
            });
          } else {
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
          }
          setModalOpen(false);
          setForm({ name: '', type: 'income', amount: '', category: '' });
          setIsEditing(false);
          setEditId(null);
          // Optionally, refetch transactions here
          const txRes = await fetch('/api/transactions');
          const txJson = await txRes.json();
          setTransactions(txJson.data || []);
        }}
        categories={categories as unknown as ModalCategory[]}
        form={form}
        setForm={setForm}
        isEditing={isEditing}
      />
    </div>
  )
}

export default Dashboard