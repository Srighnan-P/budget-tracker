"use client"

import React, { useState } from 'react'
import SideBar from './SideBar'
import {Menu as MenuIcon, X} from 'lucide-react'
import MenuBar from './MenuBar'

type StateType = {
    open: boolean;
}


const Menu = () => {

  const [state, setState] = useState<StateType>({ open: false });

  const handleOpen = () => {
    setState((prevState) => ({ open: !prevState.open }));
  }

  return (
    <div className='flex'>
        <div className='hidden lg:block'>
            <SideBar />
        </div>
        <div className='block lg:hidden ease-in-out transition duration-300'>
            <button className='absolute z-50 top-4 right-4' onClick={() => handleOpen()}>
                {state.open ? <X /> : <MenuIcon />}
            </button>
            {state.open && <MenuBar />}
        </div>
    </div>
  )
}

export default Menu