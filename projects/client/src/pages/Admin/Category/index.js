import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
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
  Text,
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubmitAdd = async (event) => {
    event.preventDefault();

    if (category_name.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
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
      showProductCategory();
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
      setIsLoading(false);
    }
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
    const selectedCategory = productCategories.find(
      (category) => category.id === category_id
    );
    setEditCategoryId(category_id);
    setCategory_name(selectedCategory.category_name);

    setSelectedCategory(selectedCategory);
  };

  const handleEditSubmit = async (event) => {
    try {
      event.preventDefault();
      if (
        category_name.trim() === "" ||
        category_name === selectedCategory?.category_name
      ) {
        toast({
          title: "Error",
          description: "Category name cannot be empty or unchanged",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

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
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setCategory_name("");
      setEditCategoryId(null);
      showProductCategory();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to edit category",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="w-[100%]">
        <div className="w-[100%] flex flex-1 justify-between">
          <Sidebar />
          <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
            <div className="w-[1140px] h-auto">
              <div className="w-full h-full">
                <Text
                  align={["left"]}
                  w="full"
                  className="font-ibmFont"
                  fontSize={30}
                  fontWeight={500}
                >
                  <Text borderBottom="2px" borderColor="black">
                    <span></span> <span className="text-purple">Product</span>
                    <span> Categories</span>
                  </Text>
                </Text>
                <Box p={4}>
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
                            color="white"
                            backgroundColor="#5D5FEF"
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
                      <Tr className="font-bold bg-[#f1f1f1]">
                        <Th>ID</Th>
                        <Th>Category Name</Th>
                        <Th className="flex justify-center w-[250px] z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                          Action
                        </Th>
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
                                  onChange={(e) =>
                                    setCategory_name(e.target.value)
                                  }
                                />
                              </FormControl>
                            ) : (
                              category.category_name
                            )}
                          </Td>
                          <Td>
                            {editCategoryId === category.id ? (
                              <Button
                                ml="20px"
                                alignSelf="center"
                                backgroundColor="#5D5FEF"
                                color="white"
                                className="font-ibmFont"
                                onClick={handleEditSubmit}
                                isLoading={isLoading}
                                loadingText="Saving"
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                ml="20px"
                                alignSelf="center"
                                backgroundColor="#5D5FEF"
                                color="white"
                                className="font-ibmFont"
                                onClick={() => handleEditButton(category.id)}
                              >
                                Edit
                              </Button>
                            )}

                            {deleteCategoryId === category.id ? (
                              <Button
                                ml="20px"
                                backgroundColor="red"
                                color="white"
                                className="font-ibmFont"
                                onClick={handleDeleteSubmit}
                                isLoading={isLoading}
                                loadingText="Deleting"
                              >
                                Confirm
                              </Button>
                            ) : (
                              <Button
                                ml="20px"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
