import {
  Box,
  Button,
  Center,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Image,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Admin/components/sidebar";
import Cookies from "js-cookie";

import OrderCard from "../../../components/orderCard";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemTotalPrice, setItemTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
          cancel={(e) => cancel(val)}
          orderDetail={(e) => orderDetail(val.id)}
          uploadPayment={(e) => uploadPayment(val)}
        />
      );
    });
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

  let uploadPayment = async (id) => {
    // code for upload payment
  };

  let orderDetail = async (id) => {
    Navigate(`/order/detail/${id}`);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/orders");
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const token = Cookies.get("adminToken");
      const response = await axios.put(
        `http://localhost:8000/admin/orders/${orderId}`,
        {},
        {
          headers: { token },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === response.data.data.id ? response.data.data : order
        )
      );
      toast({
        title: "Success",
        description: "Order status updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelivered = async (orderId) => {
    try {
      const token = Cookies.get("adminToken");
      const response = await axios.put(
        `http://localhost:8000/admin/orders/${orderId}/delivered`,
        {},
        {
          headers: { token },
        }
      );
      const updatedOrder = response.data.data;
      if (
        updatedOrder.order_status_id === 4 &&
        !updatedOrder.approved_by_user
      ) {
        setTimeout(async () => {
          try {
            const response = await axios.put(
              `http://localhost:8000/admin/orders/${orderId}/status`,
              { order_status_id: 5 },
              {
                headers: { token },
              }
            );
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === response.data.data.id ? response.data.data : order
              )
            );
            toast({
              title: "Success",
              description: "Order status updated to '5'",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } catch (error) {
            console.log(error);
            toast({
              title: "Error",
              description: "Failed to update order status",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }, 604800000); // 1 week in milliseconds
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        toast({
          title: "Success",
          description: "Order status updated to delivered",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update order status to delivered",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getOrderList();
    getOrderCart();
    fetchOrders();
  }, []);

  return (
    <>
      <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
          <div className="w-[1140px] flex justify-center items-start overflow-auto "></div>

          <Heading as="h2" mb={4}>
            Order Status List
          </Heading>
          {loading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Table variant="stripped">
              <TableCaption>Orders List</TableCaption>
              <Thead>
                <Tr>
                  <Th>ORDER ID</Th>
                  <Th>Customer ID</Th>
                  <Th>Order Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {console.log(orders)}
                {orders.map((order) => (
                  <>
                    <Tr key={order.id}>
                      <Text fontWeight="bold" color="blue.500">
                        <Td>{order.id}</Td>
                      </Text>
                      {/* <Td>{order.customer.name}</Td> */}
                      <Td>
                        <Text fontWeight="bold" color="blue.500">
                          {order.user_id}
                        </Text>
                      </Td>
                      <Td>
                        {order.order_status_id === 3 ? (
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id)}
                          >
                            Mark as Processing
                          </Button>
                        ) : order.order_status_id === 4 ? (
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleDelivered(order.id)}
                          >
                            Mark as Delivered
                          </Button>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Td>
                      <Td>
                        {order.order_status_id === 3 ? (
                          <Text fontWeight="bold" color="blue.500">
                            Shipped
                          </Text>
                        ) : order.order_status_id === 4 ? (
                          <Text fontWeight="bold" color="blue.500">
                            Waiting User Approval
                          </Text>
                        ) : order.order_status_id === 5 ? (
                          <Text fontWeight="bold" color="blue.500">
                            Completed
                          </Text>
                        ) : null}
                      </Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          )}

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
                          <Text className=" font-ibmMed">
                            {item.product.name}
                          </Text>
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
        </div>
      </div>
    </>
  );
}
