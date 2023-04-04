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
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editWarehouse, setEditWarehouse] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [pageUser, setPageUser] = useState(1);
  const [maxPageUser, setMaxPageUser] = useState(0);
  const rowPerPage = 10;
  const [adminWarehouse, setAdminWarehouse] = useState(false);
  const [editAdminWarehouse, setEditAdminWarehouse] = useState(false);
  const [whList, setWhList] = useState([]);

  const [filter, setFilter] = useState({
    searchProductName: "",
  });
  const [sort, setSort] = useState({
    sortBy: "",
  });
  const [sortMode, setSortMode] = useState("ASC");

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

  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const role = useRef();
  const warehouseName = useRef();
  const password = useRef();

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
        `http://localhost:8000/product/fetchProduct?offset=${offset}&row=${rowPerPage}&name=${filter.searchProductName}`
      );
      // &name=${filter.searchUserName}&sort=${sort.sortBy}&sortMode=${sortMode}
      console.log(getProductData);
      setProductData(getProductData.data.data.findProduct);
      setMaxPage(
        Math.ceil(getProductData.data.data.findProductAll.length / rowPerPage)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductData();
    renderPageButton();
  }, [page, maxPage, filter, sort, sortMode]);

  let handleEdit = (val) => {
    setEditEmail(val.email);
    setEditFirstName(val.first_name);
    setEditLastName(val.last_name);
    setEditRole(val.role);
    if (val?.wh_admins[0]?.warehouse?.name) {
      setEditWarehouse(val?.wh_admins[0]?.warehouse?.name);
      setEditAdminWarehouse(true);
    }
    onOpenEdit();
  };

  let openDeleteModal = async (val) => {
    try {
      onOpenDelete();
      setSelectedValue(val);
    } catch (error) {}
  };

  let deleteAdminData = async () => {
    let deleteAdminData = await axios.delete(
      `http://localhost:8000/admin/deleteAdminData?email=${selectedValue.email}`
    );

    window.location.reload();
  };

  let renderProductData = () => {
    return productData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.id}</Td>
            <Td>{val.name}</Td>
            <Td>{val.price}</Td>
            <Td>{val.product_category_id}</Td>
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
            <Td className="flex justify-center w-[350px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
              <Button
                colorScheme="green"
                size="md"
                onClick={() => handleEdit(val)}
              >
                View Product
              </Button>
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

  const sortHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSort({
      ...sort,
      [name]: value,
    });
    console.log(sort);
  };

  const changeSort = () => {
    if (sortMode === "ASC") {
      setSortMode("DESC");
    } else {
      setSortMode("ASC");
    }
  };

  let addAdmin = async () => {
    try {
      let addAdmin = await axios.post("http://localhost:8000/admin/addAdmin", {
        email: email.current.value,
        first_name: firstName.current.value,
        last_name: lastName.current.value,
        role: role.current.value,
        warehouse_name: warehouseName?.current?.value,
        password: password.current.value,
      });
      toast.success(addAdmin.data.message);
      email.current.value = "";
      firstName.current.value = "";
      lastName.current.value = "";
      password.current.value = "";
      if (warehouseName?.current?.value) {
        warehouseName.current.value = "";
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  let handleRole = (val) => {
    if (val === "wh_admin") {
      setAdminWarehouse(true);
    } else {
      setAdminWarehouse(false);
    }
  };
  let handleEditRole = (val) => {
    if (val === "wh_admin") {
      setEditAdminWarehouse(true);
    } else {
      setEditAdminWarehouse(false);
      setEditWarehouse("");
    }
  };

  const whOptions = [...new Set(whList.map((val) => val.name))];

  let editAdmin = async () => {
    try {
      let editAdmin = await axios.patch(
        "http://localhost:8000/admin/editAdmin",
        {
          email: editEmail,
          first_name: editFirstName,
          last_name: editLastName,
          role: editRole,
          warehouseName: editWarehouse,
        }
      );
      console.log(editAdmin);
      toast.success(editAdmin.data.message);
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
              <Button
                colorScheme="purple"
                size="md"
                variant="outline"
                mt="10px"
                onClick={onOpenAdd}
              >
                <Text>Add Product Data</Text>
              </Button>
              <Modal
                isOpen={isOpenAdd}
                onClose={(e) => {
                  onCloseAdd();
                  setAdminWarehouse(false);
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
                          <Text className="font-ibmMed">Email</Text>
                        </FormLabel>
                        <Input
                          ref={email}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin Email"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">First Name</Text>
                        </FormLabel>
                        <Input
                          ref={firstName}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin First Name"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Last Name</Text>
                        </FormLabel>
                        <Input
                          ref={lastName}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin Last Name"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Role</Text>
                        </FormLabel>
                        <Select
                          ref={role}
                          rounded="lg"
                          variant="filled"
                          placeholder="Choose Admin Role"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(e) => handleRole(role.current.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="wh_admin">Warehouse Admin</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Password</Text>
                        </FormLabel>
                        <InputGroup>
                          <Input
                            ref={password}
                            rounded="lg"
                            variant="filled"
                            type={show ? "text" : "password"}
                            placeholder="Admin Password"
                            bg="#f5f5f5"
                            border-1
                            borderColor={"#D9D9D9"}
                          />
                          <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? (
                                <Icon as={ViewIcon} />
                              ) : (
                                <Icon as={ViewOffIcon} />
                              )}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        rounded="lg"
                        alignSelf="center"
                        backgroundColor="#5D5FEF"
                        color="white"
                        className="font-ibmReg"
                        onClick={addAdmin}
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
                  setEditAdminWarehouse(false);
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
                          <Text className="font-ibmMed">Email</Text>
                        </FormLabel>
                        <Input
                          ref={email}
                          rounded="lg"
                          variant="filled"
                          value={editEmail}
                          isDisabled="true"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(event) => setEditEmail(event.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">First Name</Text>
                        </FormLabel>
                        <Input
                          ref={firstName}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin First Name"
                          value={editFirstName}
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          onChange={(event) =>
                            setEditFirstName(event.target.value)
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Last Name</Text>
                        </FormLabel>
                        <Input
                          ref={lastName}
                          rounded="lg"
                          variant="filled"
                          placeholder="Admin Last Name"
                          value={editLastName}
                          onChange={(event) =>
                            setEditLastName(event.target.value)
                          }
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text className="font-ibmMed">Role</Text>
                        </FormLabel>
                        <Select
                          ref={role}
                          rounded="lg"
                          variant="filled"
                          placeholder="Choose Admin Role"
                          bg="#f5f5f5"
                          border-1
                          borderColor={"#D9D9D9"}
                          value={editRole}
                          onChange={(event) => {
                            handleEditRole(role.current.value);
                            setEditRole(event.target.value);
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="wh_admin">Warehouse Admin</option>
                        </Select>
                      </FormControl>
                      <Button
                        rounded="lg"
                        alignSelf="center"
                        backgroundColor="#5D5FEF"
                        color="white"
                        className="font-ibmReg"
                        onClick={editAdmin}
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
                    name="sortBy"
                    placeholder="Sort By"
                    color={"gray"}
                    w="200px"
                    onChange={sortHandler}
                  >
                    <option value="sortId">ID</option>
                    <option value="sortEmail">Email</option>
                    <option value="sortFirstName">First Name</option>
                    <option value="sortLastName">Last Name</option>
                    <option value="sortRole">Role</option>
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
                      <Th>Product Name</Th>
                      <Th>Price</Th>
                      <Th>Product Category</Th>
                      <Th>Image Url</Th>
                      <Th>Created At</Th>
                      <Th className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                        Action
                      </Th>
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
                            Do you want to delete this user?
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
                        onClick={deleteAdminData}
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
