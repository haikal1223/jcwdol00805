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
  const [uid, setUid] = useState("");
  const [userCart, setUserCart] = useState([]);

  let getUserCart = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setUid(response.data.data.uid);
      let user_uid = response.data.data.uid;
      let getUserCart = await axios.get(
        `http://localhost:8000/cart/getUserCart?user_uid=${user_uid}`
      );
      console.log(getUserCart);
      setUserCart(getUserCart.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getUserCart();
  }, []);

  const renderCart = () => {
    return userCart.map((val, idx) => {
      return <CartCard cartData={val} productIdx={idx} />;
    });

    // return <CartCard />;
    // productData={val} productIdx={idx} func={addCart}
    //  />;
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
        renderCart()
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
