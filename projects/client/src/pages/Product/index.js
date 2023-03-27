import {
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
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Product(props) {
  const [uid, setUid] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const location = useLocation();

  const Navigate = useNavigate();

  const { id } = useParams();

  let getProductDetail = async () => {
    try {
      let getProductDetail = await axios.get(
        `http://localhost:8000/product/detail?id=${id}`
      );
      setPrice(getProductDetail.data.data[0].price);
    } catch (error) {}
  };

  let getCartFilterProduct = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setUid(response.data.data.uid);
      let user_uid = response.data.data.uid;
      let getCartFilterProduct = await axios.get(
        `http://localhost:8000/cart/getCartFilterProduct?user_uid=${user_uid}&product_id=${id}`
      );
      if (getCartFilterProduct.data.data[0]) {
        setQuantity(getCartFilterProduct.data.data[0].quantity + 1);
      } else {
        setQuantity(1);
      }
    } catch (error) {}
  };

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

  useEffect(() => {
    getProductDetail();
    getCartFilterProduct();
    getProductStock();
  }, []);

  let handleAddOrder = async () => {
    try {
      if (!props.login) {
        toast.error("Please log in first", {
          duration: 3000,
        });
      } else {
        if (quantity === 1) {
          let addCart = await axios.post(`http://localhost:8000/cart/addCart`, {
            quantity,
            price,
            user_uid: uid,
            product_id: id,
          });
          toast.success("Added to cart", {
            duration: 3000,
          });
        } else {
          if (quantity > stock) {
            toast.error("Your cart has maximum stock of the product", {
              duration: 3000,
            });
          } else {
            let updateCart = await axios.patch(
              `http://localhost:8000/cart/updateCart?user_uid=${uid}&product_id=${id}`,
              {
                quantity,
                price,
              }
            );
            toast.success("Added to cart", {
              duration: 3000,
            });
          }
        }
        getCartFilterProduct();
      }
    } catch (error) {}
  };

  return (
    <>
      <div> This is product page {id}</div>
      <div> Stock: {stock}</div>
      {stock > 0 ? (
        <Button onClick={handleAddOrder}> This is product page {id}</Button>
      ) : (
        <Button isDisabled="true"> This is product page {id}</Button>
      )}
      <Toaster />
    </>
  );
}
