import {
  ButtonGroup,
  IconButton,
  Box,
  Card,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Button,
  CardBody,
  Image,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
export default function Product(props) {
  const [userId, setUserId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const { id } = useParams();
  const Navigate = useNavigate();
  const location = useLocation();
  const [productData, setProductData] = useState([]);

  let getProductDetail = async () => {
    try {
      let getProductDetail = await axios.get(
        `http://localhost:8000/product/detail/${id}`
      );
      setProductData(getProductDetail.data.data[0]);
      setPrice(getProductDetail.data.data[0].price);
    } catch (error) {}
  };

  let getCartFilterProduct = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setUserId(response.data.data.id);
      if (id) {
        let getCartFilterProduct = await axios.get(
          `http://localhost:8000/cart/getCartFilterProduct?user_id=${userId}&product_id=${id}`
        );
        if (getCartFilterProduct.data.data[0]) {
          setQuantity(getCartFilterProduct.data.data[0].quantity + 1);
        } else {
          setQuantity(1);
        }
      }
    } catch (error) {}
  };

  let updateQuantityNumber = () =>{
    setUpdateQuantity(quantity)
  }
  let getProductStock = async () => {
    try {
      setStock(0);
      let sumStock = 0;
      let getProductStock = await axios.get(
        `http://localhost:8000/product/productStock?product_id=${id}`
      );
      for (let i = 0; i < getProductStock.data.data.length; i++) {
        sumStock += getProductStock.data.data[i].stock;
      }
      setStock(sumStock);
    } catch (error) {}
  };

  let handleAddOrder = async () => {
    try {
      if (!props.login) {
        toast.error("Please log in first", {
          duration: 3000,
        });
      } else {
        if (quantity === 1) {
          console.log(userId);
          let addCart = await axios.post(`http://localhost:8000/cart/addCart`, {
            quantity: updateQuantity,
            price,
            user_id: userId,
            product_id: id,
          });

          toast.success("Added to cart", {
            duration: 3000,
          });
        } else {
          if (updateQuantity > stock) {
            toast.error("Your cart has maximum stock of the product", {
              duration: 3000,
            });
          } else {
            let updateCart = await axios.patch(
              `http://localhost:8000/cart/updateCart?user_id=${userId}&product_id=${id}`,
              {
                quantity: updateQuantity,
                price,
              }
            );
            toast.success("Added to cart", {
              duration: 3000,
            });
          }
        }
        getCartFilterProduct();
        setUpdateQuantity(quantity);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setUpdateQuantity(updateQuantity + 1);
    } else if (type === "decrease" && updateQuantity > 1) {
      setUpdateQuantity(updateQuantity - 1);
    }
  };
  useEffect(() => {
    getProductDetail();
  }, []);

  useEffect(() => {
    getProductDetail();
    getProductStock();
  }, []);
  
  useEffect(() => {
    getCartFilterProduct();
  }, [userId]);

  useEffect(() => {
    updateQuantityNumber();
  }, [quantity]);

  return (
    <div>
      <Card w="full">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image
            h="200px"
            w="full"
            p="2"
            objectFit="contain"
            src={productData.image_url}
          />

          <Text align="center">{productData.name}</Text>
          <Text align="center">
            {productData.price?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Text>
          <Text align="center">Stock: {stock}</Text>

          <Box p="5">
            <Box w="full" as="button" mt={10}>
              <ButtonGroup spacing="2">
                <IconButton
                  aria-label="decrease quantity"
                  icon={<MinusIcon />}
                  onClick={() => handleQuantityChange("decrease")}
                  size="sm"
                  variant="outline"
                  isDisabled={updateQuantity === 1}
                />
                {updateQuantity > stock ? (
                  <Button
                    w="full"
                    bg={"#5D5FEF"}
                    color="white"
                    _hover={{
                      color: "blue.500",
                      bg: "white",
                      border: "1px solid skyblue",
                    }}
                    onClick={handleAddOrder}
                    isDisabled={updateQuantity > stock}
                  >
                    ADD TO CART ({updateQuantity - 1})
                  </Button>
                ) : (
                  <Button
                    w="full"
                    bg={"#5D5FEF"}
                    color="white"
                    _hover={{
                      color: "blue.500",
                      bg: "white",
                      border: "1px solid skyblue",
                    }}
                    onClick={handleAddOrder}
                    isDisabled={updateQuantity > stock}
                  >
                    ADD TO CART ({updateQuantity})
                  </Button>
                )}
                <IconButton
                  aria-label="increase quantity"
                  icon={<AddIcon />}
                  onClick={() => handleQuantityChange("increase")}
                  size="sm"
                  variant="outline"
                  isDisabled={updateQuantity == stock}
                />
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
  );
}