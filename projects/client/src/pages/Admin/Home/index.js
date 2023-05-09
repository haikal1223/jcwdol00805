import React from 'react'
import Sidebar from '../components/sidebar'
import { Toaster } from 'react-hot-toast'

const AdminHome = () => {
  
  return (
      <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
          <div className='w-[1140px] min-h-screen flex justify-center items-start overflow-auto '>

              {/*REPLACE BELOW FOR CONTENT*/}
              <div className='w-full h-[700px] flex flex-col justify-start items-start gap-10'>
                <div className='font-ibmBold text-4xl text-dgrey'>
                  <span>Welcome to </span> <span className='text-purple'>Admin</span><span> Homepage</span>
                </div>
                <div className='w-[100%] flex flex-col gap-2 font-ibmMed text-xl text-grey'>
                  <div className='text-dgrey'>Routes</div>
                  <hr className='w-[100%]' />
                  <div><span className='text-purple'>/user</span> - Manage user data</div>
                  <div><span className='text-purple'>/product</span> - Manage product details</div>
                  <div><span className='text-purple'>/category</span> - Manage product category data</div>
                  <div><span className='text-purple'>/warehouse</span> - Manage warehouse location</div>
                  <div><span className='text-purple'>/order</span> - Manage order status</div>
                  <div><span className='text-purple'>/mutation</span> - Manage stock mutation between warehouses</div>
                  <div><span className='text-purple'>/dashboard</span> - Oversee sales & stock condition</div>
                </div>
              </div>

          </div>
        </div>
        <Toaster/>
      </div>
  )
}

export default AdminHome