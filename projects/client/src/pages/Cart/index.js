import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Icon,
  InputGroup,
  InputRightElement,
  HStack,
  Spinner,
  Editable,
  EditablePreview,
  EditableInput,
  EditableTextarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import { MinusIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import "../../App.css";
import CartCard from "../../components/cartCard";

export default function Cart() {
  const [id, setId] = useState("");
  const [userCart, setUserCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [stock, setStock] = useState(0);

  let getUserCart = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setId(response.data.data.id);
      let price = 0;
      if (id) {
        let getUserCart = await axios.get(
          `http://localhost:8000/cart/getUserCart?user_id=${id}`
        );
        setUserCart(getUserCart.data.data);
        for (let i = 0; i < getUserCart.data.data.length; i++) {
          price +=
            getUserCart.data.data[i].quantity * getUserCart.data.data[i].price;
        }
        setTotalPrice(price);
      }
    } catch (error) {}
  };

  let deleteCart = async (val) => {
    try {
      let delCart = await axios.delete(
        `http://localhost:8000/cart/delCart?id=${val.id}`
      );
      getUserCart();
    } catch (error) {}
  };
  useEffect(() => {
    getUserCart();
  }, [id]);

  let addCart = async (val) => {
    try {
      console.log(val);
      let sumStock = 0;
      let getProductStock = await axios.get(
        `http://localhost:8000/product/productStock?product_id=${val.product_id}`
      );
      for (let i = 0; i < getProductStock.data.data.length; i++) {
        sumStock += getProductStock.data.data[i].stock;
      }
      setStock(sumStock);
      if (val.quantity < sumStock) {
        let addCart = await axios.patch(
          `http://localhost:8000/cart/updateNumberCart?id=${val.id}`,
          {
            quantity: val.quantity + 1,
          }
        );
      }
      getUserCart();
    } catch (error) {}
  };

  let minCart = async (val) => {
    try {
      if (val.quantity === 1) {
        let delCart = await axios.delete(
          `http://localhost:8000/cart/delCart?id=${val.id}`
        );
      } else {
        let minCart = await axios.patch(
          `http://localhost:8000/cart/updateNumberCart?id=${val.id}`,
          {
            quantity: val.quantity - 1,
          }
        );
      }
      getUserCart();
    } catch (error) {}
  };
  const renderCart = () => {
    return userCart.map((val, idx) => {
      return (
        <CartCard
          cartData={val}
          productIdx={idx}
          deleteFunction={(e) => deleteCart(val)}
          addFunction={(e) => addCart(val)}
          minFunction={(e) => minCart(val)}
        />
      );
    });
  };
  return (
    <>
      <Text
        align={["left"]}
        w="full"
        pt="30px"
        px="30px"
        className="font-ibmFont"
        fontSize={24}
        fontWeight={700}
      >
        <Text borderBottom="2px" borderColor="gray">
          Cart
        </Text>
      </Text>
      {userCart.length > 0 ? (
        <>
          {renderCart()}
          <Text
            mt="20px"
            align={["right"]}
            w="full-60px"
            mx="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={500}
            borderTop="2px"
            borderColor="gray"
          >
            Total Price:{" "}
            <Text fontSize={24} fontWeight={700}>
              Rp{totalPrice.toLocaleString('id-ID')}
            </Text>
          </Text>
        </>
      ) : (
        <Text
          align={["left"]}
          w="full"
          py="30px"
          px="30px"
          className="font-ibmFont"
          fontSize={18}
          fontWeight={500}
        >
          Your cart is empty
        </Text>
      )}
    </>
  );
}
