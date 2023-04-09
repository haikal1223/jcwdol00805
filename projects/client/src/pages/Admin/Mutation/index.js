import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import {TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight} from 'react-icons/tb'
import { 
    Box
    , Button
    , HStack
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
import { Search2Icon, AddIcon } from '@chakra-ui/icons'
import {toast, Toaster} from 'react-hot-toast'
import Cookies from "js-cookie";

const AdminMutation = () => {
    const [uid, setUid] = useState('')
    const [whid, setWhid] = useState('')
    const [filter, setFilter] = useState({
        searchMutationId: '',
        filterWarehouse: '',
        filterStatus: '' 
    })
    const [filteredMutation, setFilteredMutation] = useState([])
    const [whList, setWhList] = useState([])
    const [status, setStatus] = useState([])
    const [search, setSearch] = useState(false)
    const [sort, setSort] = useState('ORDER BY a.createdAt DESC, a.id DESC')
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const rowPerPage = 10


    const getUid = async () => {
        try {
          let token = Cookies.get('adminToken')
          let response = await axios.get(
            `http://localhost:8000/admin/verify-token?token=${token}`
          );
            setUid(response.data.data.id)
        } catch (error) {
            console.log(error.message)
        }
      };
    
    const fetchWarehouse = async () => {
        if(uid) {
            try {
                let response = await axios.get(
                    `http://localhost:8000/admin/fetch-warehouse?id=${uid}`
                )
                setWhid(response.data.data[0][0].wh_id)
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const fetchWhList = async () => {
        try {
            let response = await axios.get(
                `http://localhost:8000/admin-mutation/fetch-wh-list`
            )
            setWhList(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    const fetchStatus = async () => {
        try {
            let response = await axios.get(
                `http://localhost:8000/admin-mutation/fetch-status`
            )
            setStatus(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    
    const fetchMutation = async() => {
        const offset = (page - 1) * rowPerPage
        if(whid) {
            try {
                let response = await axios.get(
                    `http://localhost:8000/admin-mutation/view?id=${filter.searchMutationId}&wh=${filter.filterWarehouse}&status=${filter.filterStatus}&sort=${sort}&offset=${offset}&row=${rowPerPage}`
                )
                setFilteredMutation(response.data.data.mutation)
                setMaxPage(Math.ceil(parseInt(response.data.data.numMutation)/rowPerPage))
                if(response.data.data.mutation.length == 0) {
                    toast.error(
                        'No mutation found. Try different query'
                    )
                }
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const renderMutation = () =>{
        return filteredMutation.map((val,idx) => {
            const createDate = new Date(val.createdAt)
            const formattedCreateDate = createDate.getFullYear() + '-' + 
                                        ('0' + (createDate.getMonth()+1)).slice(-2) + '-' + 
                                        ('0' + createDate.getDate()).slice(-2) + ' ' +
                                        ('0' + createDate.getHours()).slice(-2) + ':' + 
                                        ('0' + createDate.getMinutes()).slice(-2) + ':' + 
                                        ('0' + createDate.getSeconds()).slice(-2) + ' ' +
                                        '+' + ('0' + (-createDate.getTimezoneOffset()/60)).slice(-2) + '00';
            const updateDate = new Date(val.updatedAt)
            const formattedUpdateDate = updateDate.getFullYear() + '-' + 
                                        ('0' + (updateDate.getMonth()+1)).slice(-2) + '-' + 
                                        ('0' + updateDate.getDate()).slice(-2) + ' ' +
                                        ('0' + updateDate.getHours()).slice(-2) + ':' + 
                                        ('0' + updateDate.getMinutes()).slice(-2) + ':' + 
                                        ('0' + updateDate.getSeconds()).slice(-2) + ' ' +
                                        '+' + ('0' + (-updateDate.getTimezoneOffset()/60)).slice(-2) + '00';
            return (
                <Tr className="bg-white" key={idx}>
                    <Td>{val.id}</Td>
                    <Td>{val.origin_wh_name}</Td>
                    <Td>{val.target_wh_name}</Td>
                    <Td>{val.product_id}</Td>
                    <Td>{val.quantity}</Td>
                    <Td>{val.current_origin_stock}</Td>
                    <Td>{val.order_id}</Td>
                    <Td>{formattedCreateDate}</Td>
                    <Td>{formattedUpdateDate}</Td>
                    <Td>{val.reviewer}</Td>
                    <Td>{val.status}</Td>
                    <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-white shadow-[-10px_0px_30px_0px_#efefef]">action</Td>
                </Tr>
            )
        })
    }

    // crud
    const addRequest = async() => {
        try {
            
        } catch (error) {
            console.log(error.message)
        }
    }
    const approveRequest = async() => {
        try {
            
        } catch (error) {
            console.log(error.message)
        }
    }
    const cancelRequest = async() => {
        try {
            
        } catch (error) {
            console.log(error.message)
        }
    }
    const rejectRequest = async() => {
        try {
            
        } catch (error) {
            console.log(error.message)
        }
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

    // search, sort & filter
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
    const sortHandler = (e) => {
        const value = e.target.value
        setSort(value)
    }
    
    useEffect(() => {
        getUid()
        fetchWhList()
        fetchStatus()
    },[])
    useEffect(() => {
        fetchWarehouse()
    },[uid])
    useEffect(() => {
        fetchMutation()
    },[whid, page, search, sort, filter.filterWarehouse, filter.filterStatus])

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          
            {/*REPLACE BELOW FOR CONTENT*/}
            <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Text className="font-ibmMed text-4xl">Stock Mutation</Text>
                    <Button 
                        color={"white"} 
                        bg='#5D5FEF' 
                        leftIcon={<AddIcon/>} 
                        _hover={{bg:'white', color:'#5D5FEF', border:'1px', borderColor:'#5D5FEF'}}
                    >request</Button>
                </HStack>
                <hr className="my-4 border-[2px]"/>
                <HStack justifyContent={'space-between'} className="mb-4">
                    <div className="w-auto flex justify-between items-center">
                        <InputGroup w={'180px'} mr={2}>
                            <Input name="searchMutationId" onChange={searchInputHandler} placeholder='search mutation id' className='p-1'/>
                        </InputGroup>
                        <IconButton onClick={searchButtonHandler} bg='#5D5FEF' aria-label='search product' icon={<Search2Icon color='white'/>}/>
                        <Text w={'auto'} className="ml-7 mr-1 font-ibmMed">Request for :</Text>
                        <Select w={'180px'} name="filterWarehouse" placeholder='All warehouse' color={'gray'} onChange={searchInputHandler}>
                            {whList.map((val,idx) => {
                                return (
                                    <option value={val.id} key={idx}>{val.name}</option>
                                )
                            })}
                        </Select>
                        <Text w={'auto'} className="ml-7 mr-1 font-ibmMed">Status :</Text>
                        <Select w={'180px'} name="filterStatus" placeholder='All status' color={'gray'} onChange={searchInputHandler}>
                            {
                                status.map((val,idx) => {
                                    return (
                                        <option value={val.id} key={idx}>{val.status}</option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <Select w={'auto'} color={'gray'} onChange={sortHandler}>
                        <option value="ORDER BY a.createdAt DESC, a.id DESC">order by create date (Z-A)</option>
                        <option value="ORDER BY a.createdAt ASC, a.id ASC">order by create date (A-Z)</option>
                    </Select>
                </HStack>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr className="font-bold bg-[#f1f1f1]">
                            <Td>id</Td>
                            <Td>origin WH</Td>
                            <Td>target WH</Td>
                            <Td>pID</Td>
                            <Td>requested</Td>
                            <Td>available</Td>
                            <Td>order id</Td>
                            <Td>created at</Td>
                            <Td>last modified</Td>
                            <Td>reviewer</Td>
                            <Td>status</Td>
                            <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">action</Td>
                        </Tr>
                        </Thead>
                        <Tbody className="bg-white">
                            {
                                filteredMutation.length >0 ? renderMutation() :
                                (
                                    <Tr>
                                        <Td colSpan="9" textAlign="center">
                                            No stock mutation found
                                        </Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                
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

export default AdminMutation;
