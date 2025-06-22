import React from 'react'
import Link from 'next/link'

const MenuBar = () => {
  return (
    <div className='w-full bg-primary-foreground absolute top-0 right-0 h-screen pl-4 ease-in-out transition-all delay-200 shadow-2xl z-40'>
      <div className=''>
        <div className='flex-col pt-14 space-y-6 pl-6'>
          <div className='pb-6'>
            <Link href="/" className='text-white text-2xl'>Dashboard</Link>
          </div>
          <div className='pb-6'>
            <Link href="/transactions" className='text-white text-2xl'>Transactions</Link>
          </div>
          <div className='pb-6'>
            <Link href="/categories" className='text-white text-2xl'>Categories</Link>
          </div>
          <div className='pb-6'>
            <Link href="/budget" className='text-white text-2xl'>Budget</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar