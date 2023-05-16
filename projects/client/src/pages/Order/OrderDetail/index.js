import { Button, Text, Image, Box, Divider, useToast } from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import OrderDetailCard from "../../../components/orderDetailCard";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [paymentProof, setPaymentProof] = useState([]);
  const [access, setAccess] = useState(false);
  const toast = useToast();

  let getOrder = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/order/getOrder?orderId=${orderId}`,
        {
          headers: { token: token },
        }
      );
      setOrder(response.data.data.findOrderDetail);
      if (
        response.data.data.id ===
        response.data.data.findOrderDetail[0].order.user_id
      ) {
        setAccess(true);
      } else {
        setTimeout(() => Navigate("/order"), 2000);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  let paymentProofRender = () => {
    if (order[0]?.order?.payment_proof) {
      let paymentProofSplit = order[0]?.order?.payment_proof.split(/\\/g)[2];
      setPaymentProof(`http://localhost:8000/payments/${paymentProofSplit}`);
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

  useEffect(() => {
    paymentProofRender();
  }, [order]);

  return (
    <>
      {access ? (
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
              Status:{" "}
              <strong> {`${order[0].order.order_status.status}`}</strong>
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
          {order[0]?.order?.payment_proof ? (
            <>
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
                Bukti Transfer
              </Text>
              <Image
                mx="auto"
                w="300px"
                h="auto"
                objectFit="cover"
                src={`${paymentProof}`}
                alt={"Payment Proof"}
                id="imgpreview"
              />
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
                {`${order[0].order.user_address.street_address}, ${
                  order[0].order.user_address.subdistrict
                }, ${order[0].order.user_address.city.split(".")[1]}, ${
                  order[0].order.user_address.province.split(".")[1]
                }, ${order[0].order.user_address.postal_code}`}
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
                {`Total Harga: `}
                <strong>{`Rp${order[0].order.paid_amount.toLocaleString(
                  "id-ID"
                )}`}</strong>
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
                {`Total Ongkos Kirim: `}
                <strong>{`Rp${order[0].order.shipping_cost.toLocaleString(
                  "id-ID"
                )}`}</strong>
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
                {`Total Belanja: `}
                <strong>{`Rp${(
                  order[0].order.paid_amount + order[0].order.shipping_cost
                ).toLocaleString("id-ID")}`}</strong>
              </Text>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
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
          <Text
            align={["left"]}
            w="full"
            py="30px"
            px="30px"
            className="font-ibmFont"
            fontSize={18}
            fontWeight={500}
            color="red"
          >
            You don't have access to see this order detail!
          </Text>
        </>
      )}
    </>
  );
}
