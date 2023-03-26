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

//   let getProductStock = async () => {
//     try {
//       setStock(0);
//       let sumStock = 0;
//       let getProductStock = await axios.get(
//         `http://localhost:8000/product/productStock?product_id=${id}`
//       );
//       console.log(getProductStock.data.data);
//       for (let i = 0; i < getProductStock.data.data.length; i++) {
//         sumStock += getProductStock.data.data[i].stock;
//       }
//       setStock(sumStock);
//     } catch (error) {}
//   };

  useEffect(() => {
    fetchProduct();
    // getProductStock();
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

      {/* <Link _hover={{ textDecoration: "none" }}>
        <div
          className="bg-white hover:shadow-md h-[270px] w-[140px] rounded-2xl shadow-sm overflow-hidden"
          key={props.productIdx.idx}
        >
          <Image
            alt=""
            src={props.productData.image_url}
            objectFit="cover"
            className="w-[140px] h-[147px]"
          />
          <div className="flex flex-col justify-between mt-2 gap-1 px-3">
            <div className="font-ibmMed text-[14px] line-clamp-2 ">
              {props.productData.name}
            </div>
            <div className="flex items-baseline gap-1">
              <div className="font-ibmMed text-[12px] text-purple">Rp</div>
              <div className="font-ibmMed text-[18px]">
                {props.productData.price.toLocaleString()}
              </div>
            </div>
            <Button
              h={"24px"}
              bg="#5D5FEF"
              color="white"
              onClick={props.func}
              zIndex={5}
            >
              <div className="text-[12px]">Add to cart</div>
            </Button>
          </div>
        </div>
      </Link> */}
    </>
  );
}
