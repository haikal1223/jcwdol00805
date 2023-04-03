import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { 
  Box
  , Button
  , HStack
  , Image
  , Text
  , Table
  , Thead
  , Tbody
  , Tr
  , Td
  , TableContainer
  , VStack
  , Input
} from "@chakra-ui/react";
import { useParams } from 'react-router-dom'
import axios from "axios";

const AdminProductDetail = () => {
  const { product_id } = useParams()

  const [uid, setUid] = useState('')
  const [productDetail, setProductDetail] = useState([])
  const [stockDetail, setStockDetail] = useState([])
  const [log, setLog] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editStock, setEditStock] = useState({})

  const getUid = async () => {
    try {
      let token = localStorage.getItem("adminToken");
      let response = await axios.get(
        `http://localhost:8000/admin/verify-token?token=${token}`
      );
        setUid(response.data.data.uid)
    } catch (error) {
        console.log(error.message)
    }
  };

  const fetchProductDetail = async() => {
    try {
      let response = await axios.get(`http://localhost:8000/admin-product/fetch/${product_id}`)
      setProductDetail(response.data.data.detail[0][0])
      setStockDetail(response.data.data.stock[0])
      setLog(response.data.data.log[0])
      setEditStock(
        response.data.data.stock[0].reduce((obj, item) => {
          obj[item.id] = item.stock
          return obj
        }, {})
      )
    } catch (error) {
      console.log(error.message)
    }
  }
  
  const handleEditStock = (id) => {
      setEditMode({...editMode, [id]: true});
  }

  const handleSaveStock = async (whId, oldVal) => {
    console.log(oldVal, editStock[whId], whId, uid)
    await axios.patch(`http://localhost:8000/admin-product/edit-stock/${product_id}`,{
      whid: whId, 
      oldStock: oldVal, 
      newStock: editStock[whId], 
      uid: uid
    })
    setEditMode({...editMode, [whId]: false})
  }

  useEffect(() => {
    fetchProductDetail()
    getUid()
  }, [editMode])
  
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
                  <HStack spacing={10} align={'start'}>
                    <Image boxSize={'100px'} objectFit={'cover'} src={productDetail.image_url}/>
                    <VStack w={"full"} h={'full'} justifyContent={'flex-start'}>
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
                          <Text className="font-ibmMed">
                            {new Date(productDetail.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              timeZoneName: "short",
                            })}
                          </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <br />

                  <Text className="font-ibmMed text-lg">Stock Breakdown</Text>
                  <hr className="w-[100%] my-4 border-[2px]"/>
                  <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr className="font-bold bg-[#f1f1f1]">
                            <Td>warehouse</Td>
                            <Td className="w-[250px]">city</Td>
                            <Td w={'80px'}>stock</Td>
                            <Td>action</Td>
                        </Tr>
                        </Thead>
                        <Tbody className="bg-white">
                            {
                              stockDetail.map((val, idx) => {
                                return (
                                  <Tr key={idx} className='bg-white'>
                                      <Td>{val.name}</Td>
                                      <Td className="w-[250px]">{val.city}</Td>
                                      <Td w={'80px'}>
                                        {
                                          editMode[val.id]?
                                          <Input 
                                            w={'80px'}
                                            variant="filled"
                                            value={editStock[val.id]}
                                            onChange={(event) => setEditStock({
                                              ...editStock,
                                              [val.id]:event.target.value
                                            })}
                                          />
                                          :
                                          <>{val.stock}</>
                                        }
                                      </Td>
                                      <Td>
                                          {
                                            editMode[val.id]?
                                            <Button 
                                              isDisabled={editStock[val.id] === ''} 
                                              color={'#5D5FEF'} 
                                              variant={'ghost'} 
                                              onClick={() => handleSaveStock(val.id, val.stock)}>
                                              save
                                            </Button>
                                            : 
                                            <Button color={'#5D5FEF'} variant={'ghost'} onClick={() => handleEditStock(val.id)}>edit</Button>
                                          }
                                      </Td>
                                  </Tr>
                                )
                              })
                            }
                        </Tbody>
                    </Table>
                  </TableContainer>
                  <br />

                  <Text className="font-ibmMed text-lg">Log</Text>
                  <hr className="w-[100%] my-4 border-[2px]"/>
                  <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr className="font-bold bg-[#f1f1f1]">
                            <Td>created_at</Td>
                            <Td>old_value</Td>
                            <Td>new_value</Td>
                            <Td>warehouse</Td>
                            <Td>mutation_id</Td>
                            <Td>operator</Td>
                            <Td>operation</Td>
                        </Tr>
                        </Thead>
                        <Tbody className="bg-white">
                            {
                              log.map((val, idx) => {
                                return (
                                  <Tr key={idx} className='bg-white'>
                                      <Td>
                                        {new Date(val.createdAt).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          second: "numeric",
                                          timeZoneName: "short",
                                        })}
                                      </Td>
                                      <Td>{val.old_stock}</Td>
                                      <Td>{val.new_stock}</Td>
                                      <Td>{val.name}</Td>
                                      <Td>{val.mutation_id}</Td>
                                      <Td>{val.role}</Td>
                                      <Td>{val.operation}</Td>
                                  </Tr>
                                )
                              })
                            }
                        </Tbody>
                    </Table>
                  </TableContainer>
                  <br />

                </VStack>
            </Box>
        
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
