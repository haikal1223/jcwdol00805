import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";

export default function AssignWarehouseAdmin() {
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouseAdminId, setWarehouseAdminId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [userData, setUserData] = useState([]);
  const [whData, setWHData] = useState([]);
  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("myToken");
      const response = await axios.post(
        "http://localhost:8000/admin/assign-wh-admin",
        {
          warehouseId,
          warehouseAdminId,
        },
        { headers: { token } }
      );

      toast({
        title: "Success",
        description: "Warehouse admin assigned successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setWarehouseId("");
      setWarehouseAdminId("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to assign warehouse admin",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      Navigate(0);
    }

    setIsLoading(false);
  };

  const showAllUserData = async () => {
    let token = localStorage.getItem("myToken");
    const response = await axios.get("http://localhost:8000/admin/data-user", {
      headers: { token: token },
    });
    setUserData(response.data.data);
    setWHData(response.data.allWHData);
  };

  useEffect(() => {
    showAllUserData();
  }, []);

  return (
    <Box mt={8}>
      <Heading mb={4}>Assign Warehouse Admin</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Warehouse ID</FormLabel>
            <Input
              type="text"
              width="120px"
              height="30px"
              value={warehouseId}
              onChange={(event) => setWarehouseId(event.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Warehouse Admin ID</FormLabel>
            <Input
              type="text"
              width="120px"
              height="30px"
              value={warehouseAdminId}
              onChange={(event) => setWarehouseAdminId(event.target.value)}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isLoading}
            alignSelf="flex-start"
          >
            Assign
          </Button>
        </VStack>
      </form>
      <Box mt={8}>
        <Heading mb={4}>User Data</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userData.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.first_name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Heading mb={4}>WH ADMIN</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>USER ID</Th>
              <Th>WH ID</Th>
              <Th>USERNAME</Th>
            </Tr>
          </Thead>
          <Tbody>
            {whData.map((wh) => (
              <Tr key={wh.id}>
                <Td>{wh.id}</Td>
                <Td>{wh.user_id}</Td>
                <Td>{wh.warehouse_id}</Td>
                <Td>{wh.user.first_name}</Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={async () => {
                    const token = localStorage.getItem("myToken");
                    try {
                      await axios.delete(
                        `http://localhost:8000/admin/delete/${wh.id}`,
                        { headers: { token } }
                      );
                      toast({
                        title: "Success",
                        description: "Warehouse admin deleted successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                      showAllUserData();
                    } catch (error) {
                      console.log(error);
                      toast({
                        title: "Error",
                        description: "Failed to delete warehouse admin",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
