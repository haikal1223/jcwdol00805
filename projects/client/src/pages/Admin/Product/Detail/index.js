import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { 
  Box
  , HStack
  , Text
  , VStack
} from "@chakra-ui/react";
import { useParams } from 'react-router-dom'
import axios from "axios";

const AdminProductDetail = () => {
  const { product_id } = useParams()

  const [productDetail, setProductDetail] = useState([])


  const fetchProductDetail = async() => {
    try {
      let response = await axios.get(`http://localhost:8000/admin-product/fetch/${product_id}`)
      setProductDetail(response.data.data.detail[0][0])
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchProductDetail()
  }, [])

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          
            {/*REPLACE BELOW FOR CONTENT*/}
            <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
                <Text className="font-ibmMed text-4xl">Product #{productDetail.id}</Text>
                <br />
                <VStack spacing={2} align="flex-start" w="full"className="pb-5">
                  <Text className="font-ibmMed text-lg">Product Detail</Text>
                  <hr className="w-[100%] my-4 border-[2px]"/>
                  <HStack w="full" justify={"start"} alignItems={'center'}>
                      <Text className="text-grey font-ibmReg w-[250px]">name</Text>
                      <Text className="font-ibmMed">{productDetail.name}</Text>
                  </HStack>
                  <HStack w="full" justify={"start"} alignItems={'center'}>
                      <Text className="text-grey font-ibmReg w-[250px]">category</Text>
                      <Text className="font-ibmMed">{productDetail.category_name}</Text>
                  </HStack>
                  <HStack w="full" justify={"start"} alignItems={'center'}>
                      <Text className="text-grey font-ibmReg w-[250px]">created at</Text>
                      <Text className="font-ibmMed">{productDetail.createdAt}</Text>
                  </HStack>
                  <br />

                  <Text className="font-ibmMed text-lg">Stock Breakdown</Text>
                  <hr className="w-[100%] my-4 border-[2px]"/>
                  <br />

                  <Text className="font-ibmMed text-lg">Log</Text>
                  <hr className="w-[100%] my-4 border-[2px]"/>
                  <br />

                </VStack>
            </Box>
        
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
