import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const DashboardLayout = ({children}: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen bg-gradient-to-br from-[#05070d] via-[#0b0f17] to-[#0a0e14] text-white'>
      
      <Sidebar />

      <div className='flex-1 flex flex-col'>

        <Navbar />

        <div className='flex-1 p-6'>
          {children}
        </div>

      </div>
    </div>
  )
}

export default DashboardLayout
