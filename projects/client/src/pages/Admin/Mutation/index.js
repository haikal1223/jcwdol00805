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
import { Search2Icon } from '@chakra-ui/icons'
import {toast, Toaster} from 'react-hot-toast'

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
    const [search, setSearch] = useState(false)
    const [sort, setSort] = useState('ORDER BY a.createdAt DESC, a.id DESC')
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const rowPerPage = 10


    const getUid = async () => {
        try {
          let token = localStorage.getItem("adminToken");
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
    
    const fetchMutation = async() => {
        const offset = (page - 1) * rowPerPage
        if(whid) {
            try {
                
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const renderMutation = () =>{
        return (
            <></>
        )
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
    const sortHandler = (e) => {
        const value = e.target.value
        setSort(value)
    }
    
    useEffect(() => {
        getUid()
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
                <Text className="font-ibmMed text-4xl">Stock Mutation</Text>
                <hr className="my-4 border-[2px]"/>
                <HStack justifyContent={'space-between'} className="mb-4">
                    <div className="w-auto flex justify-between items-center">
                        <InputGroup w={'180px'} mr={2}>
                            <Input name="searchMutationId" onChange={searchInputHandler} placeholder='search mutation id' className='p-1'/>
                        </InputGroup>
                        <IconButton onClick={searchButtonHandler} bg='#5D5FEF' aria-label='search product' icon={<Search2Icon color='white'/>}/>
                        <Text w={'auto'} className="ml-7 mr-1 font-ibmMed">Request for :</Text>
                        <Select w={'180px'} name="filterWarehouse" placeholder='All warehouse' color={'gray'} onChange={searchInputHandler}>
                            {whOptions.map((val,idx) => {
                                return (
                                    <option value={val} key={idx}>{val}</option>
                                )
                            })}
                        </Select>
                        <Text w={'auto'} className="ml-7 mr-1 font-ibmMed">Status :</Text>
                        <Select w={'180px'} name="filterStatus" placeholder='All status' color={'gray'} onChange={searchInputHandler}>
                            {/* change to status map */}
                            <option value="pending" key={1}>Pending Review</option>
                            <option value="approved" key={2}>Approved</option>
                            <option value="cancelled" key={3}>Cancelled</option>
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
                            {renderMutation()}
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
