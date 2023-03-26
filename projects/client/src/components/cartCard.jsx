import {
  Image,
  Link,
  Button,
  Box,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function CartCard(props) {
  const [products, setProducts] = useState([]);

  const fetchProduct = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8000/product/productData`
      );
      setProducts(response.data.data[0]);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProduct();
  }, []);

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
        <HStack width="full">
          <Box width="100px" flex="none">
            <Image
              src={products[props.cartData.product_id - 1]?.image_url}
              alt={products[props.cartData.product_id - 1]?.name}
              borderRadius="15px"
            />
          </Box>
          <VStack align="stretch">
            <Text fontSize={20} fontWeight={400} className="font-ibmFont">
              {products[props.cartData.product_id - 1]?.name}
            </Text>
            <Text fontSize={16} fontWeight={700} className="font-ibmFont">
              {props.cartData.price.toLocaleString()}
            </Text>
            <HStack>
              <Button>
                <DeleteIcon />
              </Button>
              <Button>
                <MinusIcon />
              </Button>
              <Box w="50px" textAlign="center">
                {props.cartData.quantity}
              </Box>
              <Button>
                <AddIcon />
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
