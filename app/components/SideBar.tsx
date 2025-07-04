/* eslint-disable */
'use client'
import React, { useEffect, useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowRightLeft, Tags, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ModeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/categories', label: 'Categories', icon: Tags },
]

// Add a currency context (in a separate file in a real app, but for now, just add the selector and state)
const currencyOptions = [
  { label: 'USD', symbol: '$' },
  { label: 'EUR', symbol: '€' },
  { label: 'GBP', symbol: '£' },
  { label: 'INR', symbol: '₹' },
  { label: 'JPY', symbol: '¥' },
  { label: 'CNY', symbol: '¥' },
  { label: 'AUD', symbol: 'A$' },
  { label: 'CAD', symbol: 'C$' },
];

export const CurrencyContext = createContext({
  currency: 'USD',
  symbol: '$',
  setCurrency: (c: string) => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'USD';
    }
    return 'USD';
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency);
    }
  }, [currency]);
  const symbol = currencyOptions.find(opt => opt.label === currency)?.symbol || '$';
  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

const SideBar = () => {
  const pathname = usePathname();
  const { currency, setCurrency } = useContext(CurrencyContext);

  return (
    <aside className="h-screen w-64 bg-background border-r shadow-lg flex flex-col justify-between rounded-r-3xl">
      <div>
        <div className="flex items-center justify-center py-8">
          <span className="text-2xl font-extrabold tracking-tight text-primary">💸 Budget Tracker</span>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors
                ${pathname === href ? 'bg-primary/10 text-primary shadow' : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'}`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-row items-center gap-2 px-4 py-6 border-t justify-end">
        {/* Currency Selector */}
        <select
          className="px-2 py-1 rounded-md border text-sm bg-background"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          title="Select currency"
        >
          {currencyOptions.map(opt => (
            <option key={opt.label} value={opt.label}>{opt.symbol} {opt.label}</option>
          ))}
        </select>
        <button
          className="flex items-center justify-center p-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
          title="Logout"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
        </button>
        <ModeToggle />
      </div>
    </aside>
  )
}

export default SideBar