import { Button, Text, Image, Box, Divider } from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import OrderDetailCard from "../../../components/orderDetailCard";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState([]);
  const [orderList, setOrderList] = useState([]);

  let getOrder = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/order/getOrder?orderId=${orderId}`,
        {
          headers: { token: token },
        }
      );
      setOrder(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const renderOrder = () => {
    return order.map((val, idx) => {
      return <OrderDetailCard orderData={val} productIdx={idx} />;
    });
  };

  useEffect(() => {
    getOrder();
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
        borderBottom="2px"
        borderColor="gray"
      >
        {`Order #${orderId}`}
      </Text>

      {order[0] ? (
        <Text
          align={["left"]}
          w="full"
          pt="10px"
          px="30px"
          className="font-ibmFont"
          fontSize={18}
          fontWeight={500}
        >
          {console.log(order[0])}
          Status: <strong> {`${order[0].order.order_status.status}`}</strong>
        </Text>
      ) : (
        <></>
      )}

      {order.length > 0 ? (
        <>{renderOrder()}</>
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
      <Text
        align={["left"]}
        w="full-60px"
        mx="30px"
        mt="20px"
        pt="10px"
        className="font-ibmFont"
        fontSize={20}
        fontWeight={700}
        borderTop="2px"
        borderColor="gray"
      >
        Alamat Pengiriman
      </Text>
      {order[0] ? (
        <>
          <Text
            align={["left"]}
            w="full"
            pt="10px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={700}
          >
            {`${order[0].order.user_address.recipient_name} (${order[0].order.user_address.recipient_phone})`}
          </Text>
          <Text
            align={["left"]}
            w="full"
            pt="10px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={400}
          >
            {`${order[0].order.user_address.street_address}, ${order[0].order.user_address.subdistrict}, ${order[0].order.user_address.city.split('.')[1]}, ${order[0].order.user_address.province.split('.')[1]}, ${order[0].order.user_address.postal_code}`}
          </Text>
        </>
      ) : (
        <></>
      )}
      <Text
        align={["left"]}
        w="full-60px"
        mx="30px"
        mt="20px"
        pt="10px"
        className="font-ibmFont"
        fontSize={20}
        fontWeight={700}
        borderTop="2px"
        borderColor="gray"
      >
        Rincian Pembayaran
      </Text>
      {order[0] ? (
        <>
          <Text
            align={["left"]}
            w="full"
            pt="10px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={400}
          >
            {`Total Harga: `}<strong>{`Rp${order[0].order.paid_amount.toLocaleString('id-ID')}`}</strong>
          </Text>
          <Text
            align={["left"]}
            w="full"
            pt="10px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={400}
          >
            {`Total Ongkos Kirim: `}<strong>{`Rp${order[0].order.shipping_cost.toLocaleString('id-ID')}`}</strong>
          </Text>
          <Text
            align={["left"]}
            w="full"
            pt="10px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={400}
          >
            {`Total Belanja: `}<strong>{`Rp${(order[0].order.paid_amount+order[0].order.shipping_cost).toLocaleString('id-ID')}`}</strong>
          </Text>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
