import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

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
      const token = localStorage.getItem("adminToken");
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
      const token = localStorage.getItem("adminToken");
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
        // If order status is '4' and user hasn't approved yet
        // Wait for 1 week (604800000 milliseconds) and update order status to '5'
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

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Orders
      </Heading>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Table variant="simple">
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
                      <Text>Completed</Text>
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
    </Box>
  );
}
