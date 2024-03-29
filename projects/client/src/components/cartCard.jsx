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
        `http://localhost:8000/product/productDataId?product_id=${props.cartData.product_id}`
      );
      setProducts(response.data.data[0][0]);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  useEffect(() => {
    fetchProduct();
  }, [props.deleteFunction]);

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
            <Link href={`/product/${products?.id}`}>
              <Image
                src={products?.image_url}
                alt={products?.name}
                borderRadius="15px"
              />
            </Link>
          </Box>
          <VStack align="stretch">
            <Link href={`/product/${products?.id}`}>
              <Text fontSize={20} fontWeight={400} className="font-ibmFont">
                {products?.name}
              </Text>
            </Link>
            <Text fontSize={16} fontWeight={700} className="font-ibmFont">
              Rp{props.cartData.price.toLocaleString("id-ID")}
            </Text>
            <HStack>
              <Button onClick={props.deleteFunction}>
                <DeleteIcon />
              </Button>
              <Button onClick={props.minFunction}>
                <MinusIcon />
              </Button>
              <Box w="50px" textAlign="center">
                {props.cartData.quantity}
              </Box>
              <Button onClick={props.addFunction}>
                <AddIcon />
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
