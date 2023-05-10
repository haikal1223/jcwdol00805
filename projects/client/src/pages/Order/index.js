import { Button, Text, Image, Box } from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/orderCard";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemTotalPrice, setItemTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  let getOrderList = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/order/getOrderList`,
        {
          headers: { token: token },
        }
      );
      setOrderList(response.data.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const renderOrderList = () => {
    return orderList.map((val, idx) => {
      return (
        <OrderCard
          orderData={val}
          productIdx={idx}
          cancel={(e) => cancel(val.id)}
          orderDetail={(e) => orderDetail(val.id)}
          uploadPayment={(e) => uploadPayment(val.id)}
        />
      );
    });
  };

  let cancel = async (id) => {
    try {
      if (window.confirm("Are you sure you want to cancel this order?")) {
        let response = await axios.patch(
          `http://localhost:8000/order/cancel?order_id=${id}`
        );
        toast.success("Order Canceled");
        setTimeout(() => {
          Navigate("/order");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let uploadPayment = async (id) => {
    // code for upload payment
  };

  let orderDetail = async (id) => {
    Navigate(`/order/detail/${id}`);
  };

  useEffect(() => {
    getOrderList();
  }, []);

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
          Order
        </Text>
      </Text>
      {orderList.length > 0 ? (
        <>{renderOrderList()}</>
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
          Your order list is empty
        </Text>
      )}
    </>
  );
}
