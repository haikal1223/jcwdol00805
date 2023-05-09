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
    NumberInput,
    NumberInputField
  } from "@chakra-ui/react";
import axios from "axios";
import {toast, Toaster} from 'react-hot-toast'

const ModalRequest = (props) => {
    const [newRequest, setNewRequest] = useState({
        originWh: 0,
        targetWh: 0,
        productId: 0,
        uid: props.uid,
        qty: 0
    })

    const addHandler = (e) => {
        const name = e.target.name
        const value = e.target.value

        setNewRequest({
            ...newRequest,
            [name]: value
        })
    }

    const addRequest = async() => {
        const { originWh, targetWh, qty, productId} = newRequest
        try {
            // verify if product ID exist
            let productVerify = await axios.get(`http://localhost:8000/admin-mutation/verify-product/${productId}`)
            if(productVerify.data.data === null) {
                toast.error('Product ID does not exist')
                return;
            }

            // verify if warehouse origin !=target
            if (originWh == targetWh) {
                toast.error('Cannot request stock from the same origin as target warehouse')
                return;
            }

            // verify if origin warehouse exist
            let originWhVerify = await axios.get(`http://localhost:8000/admin-mutation/verify-origin-warehouse?productId=${productId}&originWh=${originWh}`)
            if(originWhVerify.data.data === null) {
                toast.error('Stock unavailable from the requested warehouse')
                return;
            }

            // verify if stock sufficient
            let response = await axios.get(`http://localhost:8000/admin-mutation/verify-available-stock?originWh=${originWh}&productId=${productId}`)
            if(response.data.data < qty) {
                toast.error(`Stock from origin warehouse is not sufficient. Available stock : ${response.data.data}`)
                return;
            } else {
                await axios.post(`http://localhost:8000/admin-mutation/add-mutation`,{
                    originWh: parseInt(originWh), 
                    targetWh: parseInt(targetWh), 
                    qty: parseInt(qty), 
                    uid: props.uid, 
                    productId: parseInt(productId)
                })
                .then(
                    toast.success('Request successfully created')
                )
                setTimeout(
                    props.close(), 2000
                )
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    console.log(newRequest)
  return (
    <>
        <ModalCloseButton/>
        <ModalHeader>
            <Text className="font-ibmMed text-2xl pt-5 px-5">Add mutation request</Text>
        </ModalHeader>
        <ModalBody>
            <VStack spacing={2} align="flex-start" w="full" className="pb-5 px-5">
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Product ID</Text>
                    <NumberInput>
                        <NumberInputField name="productId" w={'200px'} onChange={addHandler} />
                    </NumberInput>     
                </HStack>
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Request from warehouse:</Text>
                    <Select w={'200px'} name="originWh" placeholder='select warehouse' color={'gray'} onChange={addHandler}>
                        {
                            props.whid == 'all'?
                            props.whList.filter(val => val.id !== newRequest.targetWh).map((val,idx) => {
                                return (
                                    <option key={idx} value={val.id}>{val.name}</option>
                                )
                            })
                            :
                            props.whList.filter(val => val.id !== parseInt(props.whid) && val.id !== newRequest.targetWh).map((val,idx) => {
                                return (
                                    <option key={idx} value={val.id}>{val.name}</option>
                                )
                            })
                        }
                    </Select>
                </HStack>
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Move stock to warehouse:</Text>
                    <Select w={'200px'} name="targetWh" placeholder='select warehouse' color={'gray'} onChange={addHandler}>
                        {
                            props.whid == 'all'?
                            props.whList.filter(val => val.id !== newRequest.originWh).map((val,idx) => {
                                return (
                                    <option key={idx} value={val.id}>{val.name}</option>
                                )
                            })
                            :
                            props.whList.filter(val => val.id === parseInt(props.whid)).map((val,idx) => {
                                return (
                                    <option key={idx} value={val.id}>{val.name}</option>
                                )
                            })
                        }
                    </Select>
                </HStack>
                <HStack w="full" justifyContent={'space-between'}>
                    <Text className="font-ibmMed text-lg">Quantity</Text>
                    <NumberInput>
                        <NumberInputField name="qty" w={'200px'} onChange={addHandler}/>
                    </NumberInput>     
                </HStack>
                <HStack w="full" justifyContent={'end'}>
                    <Button
                        isDisabled={
                            parseInt(newRequest.originWh) == 0 
                            || parseInt(newRequest.targetWh) == 0
                            || parseInt(newRequest.qty) == 0
                            || parseInt(newRequest.productId) == 0
                        }
                        mt={5}
                        color={"white"}
                        bgColor={"#5D5FEF"}
                        onClick={() => addRequest()}
                    >
                        +create
                    </Button> 
                </HStack> 
            </VStack>
        </ModalBody>
        <Toaster/>
        
        </>
  )
}

export default ModalRequest
