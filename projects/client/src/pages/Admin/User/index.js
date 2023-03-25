import React from 'react'
import Sidebar from '../components/sidebar'


const AdminUser = () => {
  
  return (
    <div className='w-[100%]'>
      <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
          
          {/*replace below with your content */}
          <div className='bg-violet w-[1500px] h-[1800px]'>
            User content goes here
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminUser