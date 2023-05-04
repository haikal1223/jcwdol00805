import {
  Image,
  Link,
  Button,
  Box,
  HStack,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";

export default function OrderDetailCard(props) {
  return (
    <>
      <Box
        w="full-60px"
        mx="30px"
        mt="30px"
        p="20px"
        borderWidth="1px"
        borderRadius="15px"
      >
        {/* {console.log(props.orderData)} */}
        <HStack width="full">
          <Box width="100px" flex="none">
            <Image
              src={props.orderData.product.image_url}
              alt={props.orderData.product.name}
              borderRadius="15px"
            />
          </Box>
          <VStack align="stretch" w="full">
            <Text fontSize={16} fontWeight={500} className="font-ibmFont">
              {props.orderData.product.name}
            </Text>
            <Text fontSize={20} fontWeight={500} className="font-ibmFont">
              {`${
                props.orderData.product_quantity
              } × Rp${props.orderData.product_price.toLocaleString("id-ID")}`}
            </Text>
            <HStack width="full" className="flex justify-between">
              <HStack>
                <Text fontSize={20} fontWeight={700} className="font-ibmFont ">
                  Total
                </Text>
              </HStack>
              <HStack>
                <Text fontSize={24} fontWeight={400} className="font-ibmFont ">
                  Rp{props.orderData.subtotal.toLocaleString("id-ID")}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
