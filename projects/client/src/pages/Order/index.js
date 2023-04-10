import { Button, Text, Image, Box } from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [itemTotalPrice, setItemTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  let getOrderCart = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/order/getOrderCart`,
        {
          headers: { token: token },
        }
      );
      setShippingCost(response.data.data[0].order.shipping_cost);
      setItemTotalPrice(response.data.data[0].order.paid_amount);
      setCart(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPrice = () => {
    return shippingCost + itemTotalPrice;
  };

  let cancel = async () => {
    let token = localStorage.getItem("myToken");
    try {
      if (window.confirm("Are you sure you want to cancel this order?")) {
        let response = await axios.delete(
          `http://localhost:8000/order/cancel`,
          {
            headers: { token: token },
          }
        );
        toast.success("Order Canceled");
        setTimeout(() => {
          Navigate("/cart");
        }, 2000);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getOrderCart();
  }, []);

  return (
    <>
      <div className=" mt-[15px] pl-[24px] ">
        <div className="border-b-2">
          <h1 className="font-ibmBold">Order</h1>
        </div>
        <Box
          bg="#ffffff"
          p="4"
          borderRadius="18px"
          boxShadow="18.2143px 18.2143px 36.4286px rgba(211, 209, 216, 0.25)"
        >
          <p className="mt-[15px] font-ibmMed border-b-2">
            Waiting for payment
          </p>
          <Box>
            <Box>
              {cart.length === 0 ? (
                <Spinner />
              ) : (
                cart.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    alignItems="center"
                    mb="4"
                    mt="0"
                  >
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      boxSize="84px"
                      mt="0px"
                      objectFit="contain"
                      mr="4"
                    />
                    <Box>
                      <Text className=" font-ibmMed">{item.product.name}</Text>
                      <Text className=" font-ibmReg" align="left">
                        Price:{" "}
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.product_price)}{" "}
                        * {item.product_quantity}
                      </Text>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "14px",
              }}
            >
              <span
                htmlFor="shipping-cost"
                style={{
                  marginRight: "8px",
                  marginTop: "20px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                className="font-ibmReg"
              >
                Shipping Cost
              </span>
              <span style={{ marginLeft: "auto" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(shippingCost)}
              </span>
            </div>

            <div className="border-b-2 mt-8"></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "14px",
              }}
            >
              <span
                htmlFor="shipping-cost"
                style={{
                  marginRight: "8px",
                  textAlign: "left",
                  fontSize: "20px",
                }}
                className="font-ibmBold"
              >
                Grand Total
              </span>
              <span style={{ marginLeft: "auto", fontSize: "20px" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(getTotalPrice())}
              </span>
            </div>
          </Box>
          <Box display="flex" justifyContent="space-evenly" pr="29px">
            <Button
              bg="#ff3838"
              boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
              borderRadius="28.5px"
              color="white"
              width="155px"
              height="43px"
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              bg="#5D5FEF"
              borderRadius="28.5px"
              boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
              color="white"
              width="155px"
              height="43px"
            >
              Upload Payment
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
}
