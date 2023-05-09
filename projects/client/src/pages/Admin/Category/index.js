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
  Heading,
  useToast,
  InputGroup,
  HStack,
} from "@chakra-ui/react";
import Cookies from "js-cookie";

export default function ProductCategoryAdmin() {
  const [category_name, setCategory_name] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const Navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitAdd = async (event) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      const token = Cookies.get("adminToken");
      const data = {
        category_name,
      };
      const response = await axios.post(
        "http://localhost:8000/admin/product-category",
        data,
        { headers: { token: token } }
      );
      toast({
        title: "Success",
        description: "Add Product Category Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setCategory_name("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Add Category",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      Navigate(0);
    }

    setIsLoading(false);
  };

  const showProductCategory = async () => {
    let token = Cookies.get("adminToken");
    const response = await axios.get(
      "http://localhost:8000/admin/product-category",
      {
        headers: { token: token },
      }
    );

    setProductCategories(response.data.data);
  };

  const handleEditButton = (category_id) => {
    setEditCategoryId(category_id);
  };

  const handleEditSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const token = Cookies.get("adminToken");
      const response = await axios.put(
        `http://localhost:8000/admin/product-category/${editCategoryId}`,
        {
          category_name,
        },
        {
          headers: { token: token },
        }
      );

      toast({
        title: "Success",
        description: "Edit Data Successfully",
        status: "Success",
        duration: 3000,
        isClosable: true,
      });

      setCategory_name("");
      setEditCategoryId(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error",
        status: "Error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      Navigate(0);
    }
    setIsLoading(false);
  };

  const handleDeleteButton = (category_id) => {
    setDeleteCategoryId(category_id);
  };

  const handleDeleteSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get("adminToken");
      const response = await axios.delete(
        `http://localhost:8000/admin/product-category/${deleteCategoryId}`,
        {
          headers: { token: token },
        }
      );

      toast({
        title: "Success",
        description: "Delete Product Category Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setDeleteCategoryId(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Delete Category",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    showProductCategory();
  }, [editCategoryId, deleteCategoryId]);

  return (
    <>
      <Box p={4}>
        <Heading size="md" mb={4}>
          Product Categories
        </Heading>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="4"
          mb="10"
        >
          <form onSubmit={handleSubmitAdd}>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Category Name"
                  value={category_name}
                  onChange={(e) => setCategory_name(e.target.value)}
                  width="840px"
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Saving"
                  width="100px"
                  marginLeft="20px"
                >
                  Add
                </Button>
              </InputGroup>
            </FormControl>
          </form>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Category Name</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productCategories.map((category) => (
              <Tr key={category.id}>
                <Td>{category.id}</Td>
                <Td>
                  {editCategoryId === category.id ? (
                    <FormControl>
                      <Input
                        type="text"
                        value={category_name}
                        onChange={(e) => setCategory_name(e.target.value)}
                      />
                    </FormControl>
                  ) : (
                    category.category_name
                  )}
                </Td>
                <Td>
                  {editCategoryId === category.id ? (
                    <Button
                      colorScheme="green"
                      mr="2"
                      onClick={handleEditSubmit}
                      isLoading={isLoading}
                      loadingText="Saving"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      colorScheme="green"
                      mr="2"
                      onClick={() => handleEditButton(category.id)}
                    >
                      Edit
                    </Button>
                  )}

                  {deleteCategoryId === category.id ? (
                    <HStack spacing={2}>
                      <Button
                        colorScheme="red"
                        onClick={handleDeleteSubmit}
                        isLoading={isLoading}
                        loadingText="Deleting"
                      >
                        Confirm
                      </Button>
                      <Button onClick={() => setDeleteCategoryId(null)}>
                        Cancel
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteButton(category.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}