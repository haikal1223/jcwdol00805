import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import {TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight} from 'react-icons/tb'
import { 
    Box
    , Button
    , IconButton
    , Input
    , InputGroup
    , InputRightElement
    , Modal
    , ModalOverlay
    , ModalContent
    , Select
    , Text
    , Table
    , Thead
    , Tbody
    , Tr
    , Td
    , TableContainer
} from "@chakra-ui/react";
import { Search2Icon } from '@chakra-ui/icons'
import {toast, Toaster} from 'react-hot-toast'
import OrderDetail from "./components/orderDetail";

const AdminOrder = () => {
    const [uid, setUid] = useState('')
    const [whid, setWhid] = useState('')
    const [orderList, setOrderList] = useState([])
    const [filter, setFilter] = useState({
        searchOrderId: '',
        filterWarehouse: '' 
    })
    const [filteredOrder, setFilteredOrder] = useState([])
    const [whList, setWhList] = useState([])
    const [search, setSearch] = useState(false)
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const rowPerPage = 10

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderData, setOrderData] = useState({})

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
    
    const fetchWarehouse = async () => {
        if(uid) {
            try {
                let response = await axios.get(
                    `http://localhost:8000/admin/fetch-warehouse?uid=${uid}`
                )
                setWhid(response.data.data[0][0].wh_id)
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const fetchOrder = async() => {
        const offset = (page - 1) * rowPerPage
        if(whid) {
            try {
                let response = await axios.get(
                    `http://localhost:8000/admin-order/view/${whid}?id=${filter.searchOrderId}&wh=${filter.filterWarehouse}&offset=${offset}&row=${rowPerPage}`
                )
                setOrderList(response.data.data.orders[0])
                setFilteredOrder(response.data.data.orders[0])
                setMaxPage(Math.ceil(parseInt(response.data.data.countOrders[0][0].num_order) / rowPerPage))
                setWhList(response.data.data.wh_list[0])
                if(response.data.data.orders[0].length == 0) {
                    toast.error(
                        'No order found. Try different query'
                    )
                }
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    // Modal Detail
    const handleModalOpen = async (id) => {
        try {
            let response = await axios.get(`http://localhost:8000/admin-order/order-detail/${id}`)
            setOrderData(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
        setIsModalOpen(true);
      };
    
      const handleModalClose = () => {
        setOrderData({})
        setIsModalOpen(false);
      };

    const renderOrder = () => {
            return filteredOrder.map((val, idx) => {
            return (
                <Tr key={idx} className='bg-white'>
                    <Td>{val.id}</Td>
                    <Td>{val.user_email}</Td>
                    <Td>{val.num_item}</Td>
                    <Td>{"Rp "+val.paid_amount.toLocaleString()}</Td>
                    <Td>{val.wh_name}</Td>
                    <Td>{val.createdAt.substr(0,10)}</Td>
                    <Td>{val.updatedAt.substr(0,10)}</Td>
                    <Td>{val.status}</Td>
                    <Td className="grid grid-cols-3 w-[250px] sticky right-0 z-50 bg-white shadow-[-10px_0px_30px_0px_#efefef]">
                        <Button color={'#5D5FEF'} variant={'link'} onClick={() => handleModalOpen(val.id)}>view</Button>
                        {
                            val.status === 'Pending Payment' || val.status === 'Pending Confirmation'?
                            <Button isDisabled={val.status!='Pending Confirmation'} _disabled={{color:'#D9D9D9'}} color={'#4EE476'} variant={'link'}>confirm</Button>
                            :
                            <Button isDisabled={val.status!='Processed'} _disabled={{color:'#D9D9D9'}} color={'#4EE476'} variant={'link'}>ship</Button>
                        }
                        <Button color={'red'} variant={'link'}>cancel</Button>
                    </Td>
                </Tr>
            )
        })
    }

    // pagination
    const nextPageHandler = () => {
        if(page < maxPage) {
            setPage(page + 1)
        }
    }
    const prevPageHandler = () => {
        if(page > 1) {
            setPage(page - 1)
        }
    }
    const firstPageHandler = () => {
        if(page > 1) {
            setPage(1)
        }
    }
    const maxPageHandler = () => {
        if(page < maxPage) {
            setPage(maxPage)
        }
    }

    // search & filter
    const whOptions = [...new Set(whList.map(val => val.wh_name))]
    const searchInputHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFilter({
            ...filter
            , [name]: value
        })
    }
    const searchButtonHandler = () => {
        setPage(1)
        setSearch(!search)
    }
    
    useEffect(() => {
        getUid()
    },[])
    useEffect(() => {
        fetchWarehouse()
    },[uid])
    useEffect(() => {
        fetchOrder()
    },[whid, page, search])
    

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          
            {/*REPLACE BELOW FOR CONTENT*/}
            <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
                <Text className="font-ibmMed text-4xl">Order List</Text>
                <hr className="my-4 border-[2px]"/>
                <div className="flex justify-start gap-2">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <InputGroup>
                            <Input name="searchOrderId" onChange={searchInputHandler} placeholder='... search by order id' className='p-1'/>
                            <InputRightElement pointerEvents='none' children={<Search2Icon/>}/>
                        </InputGroup>
                        <Select name="filterWarehouse" placeholder='All warehouse' color={'gray'} onChange={searchInputHandler}>
                            {whOptions.map((val,idx) => {
                                return (
                                    <option value={val}>{val}</option>
                                )
                            })}
                        </Select>
                    </div>
                    <IconButton onClick={searchButtonHandler} bg='#5D5FEF' aria-label='search product' icon={<Search2Icon color='white'/>}/>
                </div>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr className="font-bold bg-[#f1f1f1]">
                            <Td>id</Td>
                            <Td>email</Td>
                            <Td>#item</Td>
                            <Td>paid amount</Td>
                            <Td>warehouse</Td>
                            <Td>created at</Td>
                            <Td>last modified</Td>
                            <Td>status</Td>
                            <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">action</Td>
                        </Tr>
                        </Thead>
                        <Tbody className="bg-white">
                            {renderOrder()}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Modal isOpen={isModalOpen} onClose={handleModalClose} scrollBehavior={'inside'} size={'xl'}>
                    <ModalOverlay />
                    <ModalContent>
                        <OrderDetail orderDetail={orderData.order_detail} productDetail={orderData.product_detail}/>
                    </ModalContent>
                </Modal >
                <div className='w-[100%] mt-5 flex justify-center items-center gap-5'>
                    <IconButton isDisabled={page === 1} onClick={firstPageHandler} size={'sm'} bg='#5D5FEF' aria-label='previous page' icon={<TbChevronsLeft color='white' boxsize={'16px'}/>}/>
                    <IconButton isDisabled={page === 1} onClick={prevPageHandler} size={'sm'} bg='#5D5FEF' aria-label='previous page' icon={<TbChevronLeft color='white' boxsize={'16px'}/>}/>
                        <div className='font-ibmReg text-dgrey'>Page {page} / {maxPage}</div>
                    <IconButton isDisabled={page === maxPage} onClick={nextPageHandler} size={'sm'} bg='#5D5FEF' aria-label='next page' icon={<TbChevronRight color='white' boxsize={'16px'}/>}/>
                    <IconButton isDisabled={page === maxPage} onClick={maxPageHandler} size={'sm'} bg='#5D5FEF' aria-label='next page' icon={<TbChevronsRight color='white' boxsize={'16px'}/>}/>
                </div>
            </Box>
        
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default AdminOrder;
