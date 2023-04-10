import {
  Stack,
  Button,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Select,
  IconButton,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { ViewIcon, ViewOffIcon, Search2Icon } from "@chakra-ui/icons";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";

const AdminUser = () => {
  const [adminDataMode, setAdminDataMode] = useState(true);
  const [userDataMode, setUserDataMode] = useState(false);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [selectedValue, setSelectedValue] = useState({});
  const [editProductName, setEditProductName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductCategoryId, setEditProductCategoryId] = useState("");
  const [editProductImageUrl, setEditProductImageUrl] = useState("");
  const [editId, setEditId] = useState("");
  const [editWarehouse, setEditWarehouse] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [pageUser, setPageUser] = useState(1);
  const [maxPageUser, setMaxPageUser] = useState(0);
  const rowPerPage = 10;
  const [categoryName, setCategoryName] = useState([]);
  const [whList, setWhList] = useState([]);
  const [productImageName, setProductImageName] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");

  const [filter, setFilter] = useState({
    searchProductName: "",
    selectCategoryName: "",
  });
  const [sort, setSort] = useState({
    sortBy: "",
  });
  const [sortMode, setSortMode] = useState("ASC");

  const adminRoleLogged = localStorage.getItem("role");

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const productName = useRef();
  const price = useRef();
  const productCategory = useRef();
  const imageUrl = useRef();

  // let getWarehouse = async () => {
  //   try {
  //     let getWarehouse = await axios.get(
  //       `http://localhost:8000/admin/adminWarehouse`
  //     );
  //     setWhList(getWarehouse.data.data);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // useEffect(() => {
  //   getWarehouse();
  // }, []);

  let getProductData = async () => {
    const offset = (page - 1) * rowPerPage;
    try {
      let getProductData = await axios.get(
        `http://localhost:8000/product/fetchProduct?offset=${offset}&row=${rowPerPage}&name=${filter.searchProductName}&category_id=${filter.selectCategoryName}&sort=${sort.sortBy}&sortMode=${sortMode}`
      );
      setProductData(getProductData.data.data.findProduct);
      setMaxPage(
        Math.ceil(getProductData.data.data.findProductAll.length / rowPerPage)
      );
    } catch (error) {
      console.log(error);
    }
  };

  let getProductCategory = async () => {
    try {
      let getProductCategory = await axios.get(
        `http://localhost:8000/product/productCategory`
      );
      setCategoryName(getProductCategory.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductData();
    getProductCategory();
    renderPageButton();
  }, [page, maxPage, filter, sort, sortMode]);

  let handleEdit = (val) => {
    setEditProductName(val.name);
    setEditPrice(val.price);
    setEditProductCategory(val?.product_category?.category_name);
    setEditProductCategoryId(val.product_category_id);
    setEditProductImageUrl(val.image_url);
    setEditId(val.id);
    onOpenEdit();
  };

  let openDeleteModal = async (val) => {
    try {
      onOpenDelete();
      setSelectedValue(val);
    } catch (error) {}
  };

  let deleteProductData = async () => {
    let deleteProductData = await axios.delete(
      `http://localhost:8000/product/deleteProductData?id=${selectedValue.id}`
    );

    window.location.reload();
  };

  let renderProductData = () => {
    return productData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.id}</Td>
            <Td whiteSpace={"normal"}>{val.name}</Td>
            <Td>{val.price.toLocaleString("id-ID")}</Td>
            <Td>{val.product_category.category_name}</Td>
            <Td>
              <Image h={"100px"} src={val.image_url} alt={val.name} />
            </Td>
            <Td>{val.image_url}</Td>
            <Td>
              {new Date(val.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZoneName: "short",
              })}
            </Td>
            {adminRoleLogged === "admin" ? (
              <Td className="flex items-center w-[250px] h-[150px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                <Button
                  colorScheme="green"
                  size="md"
                  ml="10px"
                  onClick={() => handleEdit(val)}
                >
                  Edit Product
                </Button>
                <Button
                  colorScheme="red"
                  size="md"
                  ml="10px"
                  onClick={() => openDeleteModal(val)}
                >
                  Delete
                </Button>
              </Td>
            ) : (
              <></>
            )}
          </Tr>
        </>
      );
    });
  };

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

  let renderPageButton = () => {
    return (
      <>
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
      </>
    );
  };

  const searchInputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({
      ...filter,
      [name]: value,
    });
    console.log(filter);
  };

  const filterCategoryHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const sortHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSort({
      ...sort,
      [name]: value,
    });
  };

  const changeSort = () => {
    if (sortMode === "ASC") {
      setSortMode("DESC");
    } else {
      setSortMode("ASC");
    }
  };

  let addProduct = async () => {
    try {
      let addProduct = await axios.post(
        "http://localhost:8000/product/addProduct",
        {
          name: productName.current.value,
          price: price.current.value,
          product_category_id: productCategory.current.value,
          image_url: imageUrl.current.value,
        }
      );
      toast.success(addProduct.data.message);
      productName.current.value = "";
      price.current.value = "";
      productCategory.current.value = "";
      imageUrl.current.value = "";
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const whOptions = [...new Set(whList.map((val) => val.name))];

  let editProduct = async () => {
    try {
      let editProduct = await axios.patch(
        "http://localhost:8000/product/editProduct",
        {
          id: editId,
          name: editProductName,
          price: editPrice,
          product_category_id: editProductCategoryId,
          image_url: editProductImageUrl,
        }
      );
      console.log(editProduct);
      toast.success(editProduct.data.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
    }
  };

  return (
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
                  <span> List</span>
                </Text>
              </Text>
              {adminRoleLogged === "admin" ? (
                <Button
                  colorScheme="purple"
                  size="md"
                  variant="outline"
                  mt="10px"
                  onClick={onOpenAdd}
                >
                  <Text>Add Product Data</Text>
                </Button>
              ) : (
                <></>
              )}
              <Modal
                isOpen={isOpenAdd}
                onClose={(e) => {
                  onCloseAdd();
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <Box
                    w={["full", "md"]}
                    p={[8, 20]}
                    mt={[20, "1vh"]}
                    mx="auto"
                  >
                    <VStack spacing={4} align="flex-start" w="full">
                      <HStack
                        spacing={1}
                        align={["flex-start", "left"]}
                        w="full"
                      >
                        <Heading>
                          <Text className="font-ibmReg">Add Product Data</Text>
                        </Heading>
                        <ModalCloseButton />
                      </HStack>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Product Name</Text>
                        </FormLabel>
                        <Input
                          ref={productName}
                          rounded="lg"
                          variant="filled"
                          placeholder="Product Name"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(e) => setProductImageName(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Price</Text>
                        </FormLabel>
                        <Input
                          ref={price}
                          rounded="lg"
                          variant="filled"
                          placeholder="Price"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Product Category</Text>
                        </FormLabel>
                        <Select
                          ref={productCategory}
                          rounded="lg"
                          variant="filled"
                          placeholder="Product Category"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        >
                          {categoryName.map((val, idx) => {
                            return (
                              <option value={val.id}>
                                {val.category_name}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Image Url</Text>
                        </FormLabel>
                        <Input
                          ref={imageUrl}
                          rounded="lg"
                          variant="filled"
                          placeholder="Image URL"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(e) => setProductImageUrl(e.target.value)}
                        />
                      </FormControl>
                      {productImageUrl ? (
                        <FormControl>
                          <FormLabel>
                            <Text className="font-ibmMed">Image Preview</Text>
                          </FormLabel>
                          <Image
                            src={productImageUrl}
                            alt={"Image is not found"}
                          />
                        </FormControl>
                      ) : (
                        <></>
                      )}

                      <Button
                        rounded="lg"
                        alignSelf="center"
                        backgroundColor="#5D5FEF"
                        color="white"
                        className="font-ibmReg"
                        onClick={addProduct}
                      >
                        Add Product
                      </Button>
                    </VStack>
                  </Box>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={isOpenEdit}
                onClose={(e) => {
                  onCloseEdit();
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <Box
                    w={["full", "md"]}
                    p={[8, 20]}
                    mt={[20, "1vh"]}
                    mx="auto"
                  >
                    <VStack spacing={4} align="flex-start" w="full">
                      <HStack
                        spacing={1}
                        align={["flex-start", "left"]}
                        w="full"
                      >
                        <Heading>
                          <Text className="font-ibmReg">Edit Product Data</Text>
                        </Heading>
                        <ModalCloseButton />
                      </HStack>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Product Name</Text>
                        </FormLabel>
                        <Input
                          ref={productName}
                          rounded="lg"
                          variant="filled"
                          value={editProductName}
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(event) =>
                            setEditProductName(event.target.value)
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Price</Text>
                        </FormLabel>
                        <Input
                          ref={price}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin First Name"
                          value={editPrice}
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(event) => setEditPrice(event.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Product Category</Text>
                        </FormLabel>
                        <Select
                          ref={productCategory}
                          rounded="lg"
                          variant="filled"
                          placeholder="Choose Product Category"
                          value={editProductCategoryId}
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(event) => {
                            setEditProductCategoryId(event.target.value);
                          }}
                        >
                          {categoryName.map((val, idx) => {
                            return (
                              <option value={val.id}>
                                {val.category_name}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Image Url</Text>
                        </FormLabel>
                        <Input
                          ref={imageUrl}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin Last Name"
                          value={editProductImageUrl}
                          onChange={(event) =>
                            setEditProductImageUrl(event.target.value)
                          }
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      {editProductImageUrl ? (
                        <FormControl>
                          <FormLabel>
                            <Text className="font-ibmMed">Image Preview</Text>
                          </FormLabel>
                          <Image
                            src={editProductImageUrl}
                            alt={"Image is not found"}
                          />
                        </FormControl>
                      ) : (
                        <></>
                      )}
                      <Button
                        rounded="lg"
                        alignSelf="center"
                        backgroundColor="#5D5FEF"
                        color="white"
                        className="font-ibmReg"
                        onClick={editProduct}
                      >
                        Edit Product
                      </Button>
                    </VStack>
                  </Box>
                </ModalContent>
              </Modal>
              <div className="flex justify-between mt-4">
                <div className="mb-4">
                  <InputGroup>
                    <Input
                      w="350px"
                      name="searchProductName"
                      placeholder="Search by Product name"
                      className="p-1"
                      onChange={searchInputHandler}
                    />
                    <InputRightElement
                      pointerEvents="none"
                      children={<Search2Icon />}
                    />
                  </InputGroup>
                </div>
                <div className="mb-4 flex justify-between" w="450px">
                  <Select
                    name="selectCategoryName"
                    placeholder="Select Category"
                    color="gray"
                    w="200px"
                    onChange={filterCategoryHandler}
                  >
                    {categoryName.map((val, idx) => {
                      return (
                        <option value={val.id}>{val.category_name}</option>
                      );
                    })}
                  </Select>
                  <Select
                    ml="20px"
                    name="sortBy"
                    placeholder="Sort By"
                    color={"gray"}
                    w="200px"
                    onChange={sortHandler}
                  >
                    <option value="sortId">ID</option>
                    <option value="sortProductName">Product Name</option>
                    <option value="sortPrice">Price</option>
                  </Select>
                  <Button w="100px" ml="20px" onClick={changeSort}>
                    {sortMode === "ASC" ? "A to Z" : "Z to A"}
                  </Button>
                </div>
              </div>
              <TableContainer mt="10px" w="1140px">
                <Table variant="simple" w="1140px">
                  <Thead>
                    <Tr className="font-bold bg-[#f1f1f1]">
                      <Th>ID</Th>
                      <Th maxWidth="400px">Product Name</Th>
                      <Th>Price</Th>
                      <Th>
                        <p>Product</p>
                        <p>Category</p>
                      </Th>
                      <Th>
                        <p>Image</p>
                        <p>Preview</p>
                      </Th>
                      <Th>Image Url</Th>
                      <Th>Created At</Th>
                      {adminRoleLogged === "admin" ? (
                        <Th className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                          Action
                        </Th>
                      ) : (
                        <></>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody className="bg-white">{renderProductData()}</Tbody>
                </Table>
              </TableContainer>
              {renderPageButton()}
              <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                  <Box
                    w={["full", "md"]}
                    p={[8, 20]}
                    mt={[20, "1vh"]}
                    mx="auto"
                  >
                    <VStack spacing={4} align="flex-start" w="full">
                      <HStack
                        spacing={1}
                        align={["flex-start", "left"]}
                        w="full"
                      >
                        <Heading>
                          <Text className="font-ibmReg">
                            Do you want to delete this product?
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
                        onClick={deleteProductData}
                        size="lg"
                      >
                        Delete
                      </Button>
                      <Button
                        rounded="lg"
                        alignSelf="center"
                        backgroundColor="white"
                        color="#5D5FEF"
                        className="font-ibmReg"
                        variant="outline"
                        onClick={onCloseDelete}
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </VStack>
                  </Box>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminUser;
