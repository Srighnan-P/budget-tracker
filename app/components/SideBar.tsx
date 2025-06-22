import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, ArrowRightLeft, Tags, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {ModeToggle} from './ThemeToggle'

const SideBar = () => {
    return (
        <div className='h-[100vh] w-[100vw] sm:w-56 bg-sidebar-accent sm:rounded-r-3xl sm:border-r-2 border-accent flex flex-col justify-between'>
          <div>
            <h1 className='text-white text-2xl text-center py-8  font-extrabold'>Budget Tracker</h1>
            <hr className='my-2 mb-5'/>
            <div className='flex-col'>
              <div className='flex-col  p-6 '>
                <Link href="/" className='flex gap-2 items-center mb-10 text-white text-xl hover:text-primary/80 ease-in-out'><LayoutDashboard /><h3>Dashboard</h3></Link>
                <Link href="/transactions" className='flex gap-2 items-center mb-10 text-white text-xl hover:text-primary/80 ease-in-out'><ArrowRightLeft /><h3>Transactions</h3></Link>
                <Link href="/categories" className='flex gap-2 items-center mb-8 text-white text-xl hover:text-primary/80 ease-in-out'><Tags /><h3>Categories</h3></Link>
              </div>
            </div>
          </div>
          <div className='flex justify-between p-6'>
            <button className='flex gap-2 text-white hover:text-primary/80 ease-in-out border-2 p-1 rounded-lg hover:bg-primary/20' onClick={()=> signOut()}><LogOut/>Logout</button>
            <ModeToggle/>
          </div>
        </div>
      )
}

export default SideBar