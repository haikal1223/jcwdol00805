import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  VStack,
  Heading,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  useToast,
  Image,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { toast, Toaster } from "react-hot-toast";
import OrderDetail from "./components/orderDetail";
import { Navigate } from "react-router-dom";

const AdminOrder = () => {
  const [uid, setUid] = useState("");
  const [whid, setWhid] = useState("");
  const [filter, setFilter] = useState({
    searchOrderId: "",
    filterWarehouse: "",
  });
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [whList, setWhList] = useState([]);
  const [search, setSearch] = useState(false);
  const [sort, setSort] = useState("ORDER BY a.createdAt DESC, a.id DESC");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const rowPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [selectedId, setSelectedId] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemTotalPrice, setItemTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState([]);
  const toast = useToast();

  const {
    isOpen: isOpenCancel,
    onOpen: onOpenCancel,
    onClose: onCloseCancel,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const getUid = async () => {
    try {
      let token = Cookies.get("adminToken");
      let response = await axios.get(
        `http://localhost:8000/admin/verify-token?token=${token}`
      );
      setUid(response.data.data.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchWarehouse = async () => {
    if (uid) {
      try {
        let response = await axios.get(
          `http://localhost:8000/admin/get-warehouse?id=${uid}`
        );
        setWhid(response.data.data[0][0].wh_id);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const fetchOrder = async () => {
    const offset = (page - 1) * rowPerPage;
    if (whid) {
      try {
        let response = await axios.get(
          `http://localhost:8000/admin-order/view/${whid}?id=${filter.searchOrderId}&wh=${filter.filterWarehouse}&sort=${sort}&offset=${offset}&row=${rowPerPage}`
        );
        setFilteredOrder(response.data.data.orders[0]);
        setMaxPage(
          Math.ceil(
            parseInt(response.data.data.countOrders[0][0].num_order) /
              rowPerPage
          )
        );
        setWhList(response.data.data.wh_list[0]);
        if (response.data.data.orders[0].length == 0) {
          toast.error("No order found. Try different query");
        }
      } catch (error) {
        console.log(error.message);
      }
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
    } finally {
      window.location.reload();
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
    } finally {
      window.location.reload();
    }
  };

  // Modal Detail
  const handleModalOpen = async (id) => {
    try {
      let response = await axios.get(
        `http://localhost:8000/admin-order/order-detail/${id}`
      );
      setOrderData(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setOrderData({});
    setIsModalOpen(false);
  };

  const renderOrder = () => {
    return filteredOrder.map((val, idx) => {
      const createDate = new Date(val.createdAt);
      const formattedCreateDate =
        createDate.getFullYear() +
        "-" +
        ("0" + (createDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + createDate.getDate()).slice(-2) +
        " " +
        ("0" + createDate.getHours()).slice(-2) +
        ":" +
        ("0" + createDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + createDate.getSeconds()).slice(-2) +
        " " +
        "+" +
        ("0" + -createDate.getTimezoneOffset() / 60).slice(-2) +
        "00";
      const updateDate = new Date(val.updatedAt);
      const formattedUpdateDate =
        updateDate.getFullYear() +
        "-" +
        ("0" + (updateDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + updateDate.getDate()).slice(-2) +
        " " +
        ("0" + updateDate.getHours()).slice(-2) +
        ":" +
        ("0" + updateDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + updateDate.getSeconds()).slice(-2) +
        " " +
        "+" +
        ("0" + -updateDate.getTimezoneOffset() / 60).slice(-2) +
        "00";

      return (
        <Tr key={idx} className="bg-white">
          <Td>{val.id}</Td>
          <Td>{val.user_email}</Td>
          <Td>{val.num_item}</Td>
          <Td>{"Rp " + val.paid_amount.toLocaleString()}</Td>
          <Td>{val.wh_name}</Td>
          <Td>{formattedCreateDate}</Td>
          <Td>{formattedUpdateDate}</Td>
          <Td>{val.status}</Td>
          <Td className="grid grid-cols-3 w-[250px] sticky right-0 z-50 bg-white shadow-[-10px_0px_30px_0px_#efefef]">
            <Button
              color={"#5D5FEF"}
              variant={"link"}
              onClick={() => handleModalOpen(val.id)}
            >
              view
            </Button>
            {val.status === "Pending Payment" ||
            val.status === "Pending Confirmation" ? (
              <Button
                isDisabled={val.status != "Pending Confirmation"}
                _disabled={{ color: "#D9D9D9" }}
                color={"#4EE476"}
                variant={"link"}
                onClick={(e) => openConfirmModal(val)}
              >
                confirm
                {console.log(val)}
              </Button>
            ) : val.status === "Processed" ? (
              <Button
                isDisabled={val.status != "Processed"}
                _disabled={{ color: "#D9D9D9" }}
                color={"#4EE476"}
                variant={"link"}
                onClick={() => handleUpdateStatus(val.id)}
              >
                ship
              </Button>
            ) : (
              <Button
                isDisabled={val.status != "Shipped"}
                _disabled={{ color: "#D9D9D9" }}
                color={"#4EE476"}
                variant={"link"}
                onClick={() => handleDelivered(val.id)}
              >
                delivered
              </Button>
            )}
            <Button
              isDisabled={val.order_status_id > 3}
              _disabled={{ color: "#D9D9D9" }}
              color={"red"}
              variant={"link"}
              onClick={(e) => openCancelModal(val.id)}
            >
              cancel
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  // pagination
  const nextPageHandler = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };
  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const firstPageHandler = () => {
    if (page > 1) {
      setPage(1);
    }
  };
  const maxPageHandler = () => {
    if (page < maxPage) {
      setPage(maxPage);
    }
  };

  // search, sort & filter
  const whOptions = [...new Set(whList.map((val) => val.wh_name))];
  const searchInputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({
      ...filter,
      [name]: value,
    });
  };
  const searchButtonHandler = () => {
    setPage(1);
    setSearch(!search);
  };
  const sortHandler = (e) => {
    const value = e.target.value;
    setSort(value);
  };

  useEffect(() => {
    getUid();
  }, []);
  useEffect(() => {
    fetchWarehouse();
  }, [uid]);
  useEffect(() => {
    fetchOrder();
  }, [whid, page, search, sort]);

  // cancel order
  const openCancelModal = async (val) => {
    try {
      onOpenCancel();
      setSelectedId(val);
    } catch (error) {}
  };

  const cancelOrder = async () => {
    try {
      let response = await axios.patch(
        `http://localhost:8000/admin-order/cancel-order/${selectedId}`
      );
      toast({
        title: "Success",
        description: "Cancel Order Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const openConfirmModal = async (val) => {
    try {
      onOpenConfirm();
      setSelectedId(val.id);
      let paymentProofSplit =
          val.payment_proof.split(/\\/g)[2];
        setPaymentProof(
          `http://localhost:8000/payments/${paymentProofSplit}`
        );
    } catch (error) {}
  };

  const confirmOrder = async () => {
    try {
      let response = await axios.patch(
        `http://localhost:8000/admin-order/confirm-order/${selectedId}`
      );
      toast({
        title: "Success",
        description: "Confirm Order Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const rejectOrder = async () => {
    try {
      let response = await axios.patch(
        `http://localhost:8000/admin-order/reject-order/${selectedId}`
      );
      toast({
        title: "Success",
        description: "Reject Order Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
            <Text className="font-ibmMed text-4xl">Order List</Text>
            <hr className="my-4 border-[2px]" />
            <HStack justifyContent={"space-between"} className="mb-4">
              <div className="flex justify-start gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <InputGroup>
                    <Input
                      name="searchOrderId"
                      onChange={searchInputHandler}
                      placeholder="... search by order id"
                      className="p-1"
                    />
                    <InputRightElement
                      pointerEvents="none"
                      children={<Search2Icon />}
                    />
                  </InputGroup>
                  <Select
                    name="filterWarehouse"
                    placeholder="All warehouse"
                    color={"gray"}
                    onChange={searchInputHandler}
                  >
                    {whOptions.map((val, idx) => {
                      return (
                        <option value={val} key={idx}>
                          {val}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <IconButton
                  onClick={searchButtonHandler}
                  bg="#5D5FEF"
                  aria-label="search product"
                  icon={<Search2Icon color="white" />}
                />
              </div>
              <Select w={"auto"} color={"gray"} onChange={sortHandler}>
                <option value="ORDER BY a.createdAt DESC, a.id DESC">
                  order by create date (Z-A)
                </option>
                <option value="ORDER BY a.createdAt ASC, a.id ASC">
                  order by create date (A-Z)
                </option>
              </Select>
            </HStack>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr className="font-bold bg-[#f1f1f1]">
                    <Td>id</Td>
                    <Td>email</Td>
                    <Td>#item</Td>
                    <Td>paid amount</Td>
                    <Td>warehouse</Td>
                    <Td>created at</Td>
                    <Td>last modified</Td>
                    <Td>status</Td>
                    <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                      action
                    </Td>
                  </Tr>
                </Thead>
                <Tbody className="bg-white">{renderOrder()}</Tbody>
              </Table>
            </TableContainer>
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              scrollBehavior={"inside"}
              size={"xl"}
            >
              <ModalOverlay />
              <ModalContent>
                <OrderDetail
                  orderDetail={orderData.order_detail}
                  productDetail={orderData.product_detail}
                />
              </ModalContent>
            </Modal>

            <Modal isOpen={isOpenCancel} onClose={onCloseCancel}>
              <ModalOverlay />
              <ModalContent>
                <Box w={["full", "md"]} p={[8, 20]} mt={[20, "1vh"]} mx="auto">
                  <VStack spacing={4} align="flex-start" w="full">
                    <HStack spacing={1} align={["flex-start", "left"]} w="full">
                      <Heading>
                        <Text className="font-ibmReg">
                          Do you want to cancel the order?
                        </Text>
                      </Heading>
                      <ModalCloseButton />
                    </HStack>

                    <Button
                      rounded="lg"
                      alignSelf="center"
                      backgroundColor="#5D5FEF"
                      color="white"
                      className="font-ibmReg"
                      onClick={cancelOrder}
                      size="lg"
                    >
                      Yes, cancel it
                    </Button>
                    <Button
                      rounded="lg"
                      alignSelf="center"
                      backgroundColor="white"
                      color="#5D5FEF"
                      className="font-ibmReg"
                      variant="outline"
                      onClick={onCloseCancel}
                      size="lg"
                    >
                      No, keep it
                    </Button>
                  </VStack>
                </Box>
              </ModalContent>
            </Modal>

            <Modal isOpen={isOpenConfirm} onClose={onCloseConfirm}>
              <ModalOverlay />
              <ModalContent>
                <Box w={["full", "md"]} p={[8, 20]} mt={[20, "1vh"]} mx="auto">
                  <VStack spacing={4} align="flex-start" w="full">
                    <HStack spacing={1} align={["flex-start", "left"]} w="full">
                      <Heading>
                        <Text className="font-ibmReg">
                          Do you want to confirm the payment proof?
                        </Text>
                        <Text
                          fontSize={"20pt"}
                          my={"10px"}
                          className="font-ibmReg"
                        >
                          Order #{selectedId}
                        </Text>
                        <Image
                          w="300px"
                          h="auto"
                          objectFit="cover"
                          src={`${paymentProof}`}
                          alt={"Payment Proof"}
                          id="imgpreview"
                        />
                      </Heading>
                      <ModalCloseButton />
                    </HStack>

                    <Button
                      rounded="lg"
                      alignSelf="center"
                      backgroundColor="#5D5FEF"
                      color="white"
                      className="font-ibmReg"
                      onClick={confirmOrder}
                      size="lg"
                    >
                      Yes, confirm it
                    </Button>
                    <Button
                      rounded="lg"
                      alignSelf="center"
                      backgroundColor="white"
                      color="#5D5FEF"
                      className="font-ibmReg"
                      variant="outline"
                      onClick={rejectOrder}
                      size="lg"
                    >
                      No, reject it
                    </Button>
                  </VStack>
                </Box>
              </ModalContent>
            </Modal>

            <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
              <IconButton
                isDisabled={page === 1}
                onClick={firstPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={page === 1}
                onClick={prevPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronLeft color="white" boxsize={"16px"} />}
              />
              <div className="font-ibmReg text-dgrey">
                Page {page} / {maxPage}
              </div>
              <IconButton
                isDisabled={page === maxPage}
                onClick={nextPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronRight color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={page === maxPage}
                onClick={maxPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronsRight color="white" boxsize={"16px"} />}
              />
            </div>
          </Box>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminOrder;
