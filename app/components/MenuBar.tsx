import React from 'react'
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

const MenuBar = () => {
  const pathname = usePathname();
  return (
    <div className="fixed inset-0 z-40 bg-background/95 w-64 h-full shadow-2xl flex flex-col justify-between rounded-r-3xl border-r">
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
        <button
          className="flex items-center justify-center p-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
          title="Logout"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
        </button>
        <ModeToggle />
      </div>
    </div>
  )
}

export default MenuBar