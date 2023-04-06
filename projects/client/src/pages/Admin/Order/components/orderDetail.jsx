import {
  Tag,
  Link,
  Box,
  VStack,
  Heading,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link as RouteLink } from "react-router-dom";

export default function OrderDetail(props) {

    const {
        id,
        paid_amount,
        payment_proof,
        shipping_cost,
        user_id,
        user_email,
        wh_name,
        status
    } = props.orderDetail[0][0]

  return (
 
<>
        <ModalCloseButton/>
        <ModalHeader>
            <VStack align="flex-start" w="full" className="pt-5 px-5">
                <Text className="font-ibmReg text-3xl">Order #{id}</Text>
                <Text maxWidth={'max-content'} bg={"#5D5FEF"} p={[1]} borderRadius={'4'} className='text-white text-sm'>{status}</Text>
            </VStack>
        </ModalHeader>
        <ModalBody>
            <VStack spacing={2} align="flex-start" w="full"className="pb-5 px-5">
                <Text className="font-ibmMed text-lg">User info</Text>
                <hr className="border border-lgrey w-[100%]" />
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">user_id</Text>
                    <Text className="font-ibmMed">{user_id}</Text>
                </HStack>
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">email</Text>
                    <Text className="font-ibmMed">{user_email}</Text>
                </HStack>
                <br />

                <Text className="font-ibmMed text-lg">Product detail</Text>
                <hr className="border border-lgrey w-[100%]" />
                {
                    props.productDetail[0].map((val, idx) => {
                        return (
                            <VStack align="flex-start" w="full" key={idx}>
                                <Link
                                as={RouteLink}
                                to={`/admin/product/${val.id}`}
                                w="full"
                                fontSize={"md"}
                                className="line-clamp-1 font-ibmMed"
                                >
                                {val.name}
                                </Link>
                                <HStack w="full" justify={"space-between"}>
                                    <Text className="font-ibmReg text-grey">{val.product_quantity} x Rp {val.product_price.toLocaleString()}</Text>
                                    <Text color={"#5D5FEF"} className='font-ibmMed'>Rp {val.subtotal.toLocaleString()}</Text>
                                </HStack>
                            </VStack>
                        )
                    })
                }
                <br />

                <Text className="font-ibmMed text-lg">Shipping</Text>
                <hr className="border border-lgrey w-[100%]" />
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">warehouse</Text>
                    <Text className="font-ibmMed">{wh_name}</Text>
                </HStack>
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">shipping cost</Text>
                    <Text color={"#5D5FEF"} className="font-ibmMed">Rp {shipping_cost.toLocaleString()}</Text>
                </HStack>
                <br />

                <Text className="font-ibmMed text-lg">Transaction</Text>
                <hr className="border border-lgrey w-[100%]" />
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">paid amount</Text>
                    <Text color={"#5D5FEF"} className="font-ibmMed">Rp {paid_amount.toLocaleString()}</Text>
                </HStack>
                <HStack w="full" justify={"space-between"}>
                    <Text className="font-ibmReg text-grey">payment proof</Text>
                    <Text maxWidth={'200px'} className="line-clamp-1 font-ibmMed">{payment_proof}</Text>
                </HStack>
            </VStack>
        </ModalBody>
        
        </>
  );
}
