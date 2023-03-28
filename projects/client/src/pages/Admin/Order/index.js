import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { 
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";

const AdminOrder = () => {
    const [uid, setUid] = useState('')
    const [whid, setWhid] = useState('')
    const [orderList, setOrderList] = useState([])
    const [filteredOrder, setFilteredOrder] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const rowPerPage = 5


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
        if(whid) {
            try {
                let response = await axios.get(
                    `http://localhost:8000/admin-order/view/${whid}`
                )
                setOrderList(response.data.data[0])
                setFilteredOrder(response.data.data[0])
                setMaxPage(Math.ceil(response.data.data[0] / rowPerPage))
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const renderOrder = () => {
        const startIndex = (page - 1) * rowPerPage
        const orderPerPage = filteredOrder.slice(startIndex, startIndex + rowPerPage)

        return orderPerPage.map((val, idx) => {
            return (
                <Tr key={idx}>
                    <Td>{val.id}</Td>
                    <Td>{val.user_email}</Td>
                    <Td>{val.wh_name}</Td>
                    <Td>{val.updatedAt.substr(0,10)}</Td>
                    <Td>{val.status}</Td>
                    <Td className="grid grid-cols-3">
                        <span>View</span>
                        <span>Confirm</span>
                        <span>Delete</span>
                    </Td>
                </Tr>
            )
        })
    }
    
    useEffect(() => {
        getUid()
    },[])
    useEffect(() => {
        fetchWarehouse()
    },[uid])
    useEffect(() => {
        fetchOrder()
    },[whid])
    

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          
            {/*REPLACE BELOW FOR CONTENT*/}
            <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
                <Text className="font-ibmMed text-4xl">Order List</Text>
                <hr className="my-4 border-[2px]"/>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr className="font-bold bg-[#f1f1f1]">
                            <Td>id</Td>
                            <Td>email</Td>
                            <Td>warehouse</Td>
                            <Td>last_modified</Td>
                            <Td>status</Td>
                            <Td>action</Td>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {renderOrder()}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
