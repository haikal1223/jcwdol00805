import React, { useEffect, useState } from "react";
import {
    Button,
    VStack,
    Input,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    Select,
    Text,
    HStack,
  } from "@chakra-ui/react";
import axios from "axios";
import {toast, Toaster} from 'react-hot-toast'

const ModalStock = (props) => {
    const [data, setData] = useState({
        warehouse: '',
        stock: ''
    })

    const filterHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setData({
            ...data
            , [name]: value
        })
    }

    const addStock = async () => {
        try {
          await axios.post(`http://localhost:8000/admin-product/add-stock/22`, {
            whid: data.warehouse,
            stock: data.stock,
            uid: props.uid
          })
          .then (
            toast.success('stock successfully added')
          )
          setTimeout(
            props.close(), 2000
          )
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <>
        <ModalCloseButton/>
        <ModalHeader>
            <Text className="font-ibmReg text-xl pt-5 px-5">Add new stock</Text>
        </ModalHeader>
        <ModalBody>
            <VStack spacing={2} align="flex-start" w="full" className="pb-5 px-5">
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Warehouse</Text>
                    <Select w={'200px'} name="warehouse" placeholder='select warehouse' color={'gray'} onChange={filterHandler}>
                        {props.data.map((val,idx) => {
                            return (
                                <option key={idx} value={val.id}>{val.name}</option>
                            )
                        })}
                    </Select>
                </HStack>
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Stock</Text>
                    <Input name="stock" w={'200px'} onChange={filterHandler}/>
                </HStack>
                <HStack w="full" justifyContent={'end'}>
                    <Button
                        isDisabled={data.stock === '' || data.warehouse === ''}
                        color={"white"}
                        bgColor={"#5D5FEF"}
                        variant={"solid"}
                        onClick={() => addStock()}
                    >
                        save
                    </Button> 
                </HStack> 
            </VStack>
        </ModalBody>
        <Toaster/>
        
        </>
  )
}

export default ModalStock
