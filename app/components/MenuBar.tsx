import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, ArrowRightLeft, Tags } from 'lucide-react'

const MenuBar = () => {
  return (
    <div className='w-full bg-primary-foreground absolute top-0 right-0 h-screen pl-4 ease-in-out transition-all delay-200 shadow-2xl z-40'>
      <div className=''>
        <div className='flex-col pt-14 space-y-6 pl-6'>
          <div className='flex-col  p-6 '>
              <Link href="/" className='flex gap-2 items-center mb-10 text-primary text-xl hover:text-primary/50 ease-in-out'><LayoutDashboard /><h3>Dashboard</h3></Link>
              <Link href="/transactions" className='flex gap-2 items-center mb-10 text-primary text-xl hover:text-primary/50 ease-in-out'><ArrowRightLeft /><h3>Transactions</h3></Link>
              <Link href="/categories" className='flex gap-2 items-center mb-8 text-primary text-xl hover:text-primary/50 ease-in-out'><Tags /><h3>Categories</h3></Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar