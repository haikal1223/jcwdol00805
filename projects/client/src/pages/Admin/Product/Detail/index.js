import React from "react";
import Sidebar from "../../components/sidebar";

const AdminProductDetail = () => {
  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          
            {/*REPLACE BELOW FOR CONTENT*/}
            <div className="bg-violet w-full h-[700px]">
                This is Admin Product Detail Page
            </div>
        
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
