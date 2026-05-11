import React from 'react'
import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
        <header>
            <nav>
                <Link to="main1">Main1</Link>
                <Link to="main2">Main2</Link>
                <Link to="main3">Main3</Link>
            </nav>
        </header>
        <main className='border'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout