import {
  Stack,
  Button,
  Text,
  TableContainer,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Cookies from "js-cookie";

const AdminUser = () => {
  const [adminDataMode, setAdminDataMode] = useState(true);
  const [userDataMode, setUserDataMode] = useState(false);
  const [WHAssignMode, setWHAssignMode] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userDatax, setUserDatax] = useState([]);
  const handleClick = () => setShow(!show);
  const [selectedValue, setSelectedValue] = useState({});
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editWarehouse, setEditWarehouse] = useState("");
  const [pageAdmin, setPageAdmin] = useState(1);
  const [maxPageAdmin, setMaxPageAdmin] = useState(0);
  const [pageUser, setPageUser] = useState(1);
  const [maxPageUser, setMaxPageUser] = useState(0);
  const rowPerPage = 10;
  const [adminWarehouse, setAdminWarehouse] = useState(false);
  const [editAdminWarehouse, setEditAdminWarehouse] = useState(false);
  const [whList, setWhList] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouseAdminId, setWarehouseAdminId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [whData, setWHData] = useState([]);
  const Navigate = useNavigate();

  const [filter, setFilter] = useState({
    searchUserName: "",
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

  let changeDataMode = () => {
    setAdminDataMode(!adminDataMode);
    setUserDataMode(!userDataMode);
    setWHAssignMode(!WHAssignMode);
    setPageAdmin(1);
    setMaxPageAdmin(0);
  };

  let changeDataModeToAdmin = () => {
    setAdminDataMode(true);
    setUserDataMode(false);
    setWHAssignMode(false);
    setPageAdmin(1);
    setMaxPageAdmin(0);
  };

  let changeDataModeToUser = () => {
    setAdminDataMode(false);
    setUserDataMode(true);
    setWHAssignMode(false);
    setPageAdmin(1);
    setMaxPageAdmin(0);
  };

  let changeDataModeToWH = () => {
    setAdminDataMode(false);
    setUserDataMode(false);
    setWHAssignMode(true);
    setPageAdmin(1);
    setMaxPageAdmin(0);
  };

  let getWarehouse = async () => {
    try {
      let getWarehouse = await axios.get(
        `http://localhost:8000/admin/adminWarehouse`
      );
      setWhList(getWarehouse.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get("adminToken");
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
    const token = Cookies.get("adminToken");
    const response = await axios.get("http://localhost:8000/admin/data-user", {
      headers: { token: token },
    });
    setUserDatax(response.data.data);
    setWHData(response.data.allWHData);
  };

  useEffect(() => {
    getWarehouse();
    showAllUserData();
  }, []);

  let getAdminData = async () => {
    const offset = (pageAdmin - 1) * rowPerPage;
    try {
      let getAdminData = await axios.get(
        `http://localhost:8000/admin/adminData?offset=${offset}&row=${rowPerPage}&name=${filter.searchUserName}&sort=${sort.sortBy}&sortMode=${sortMode}`
      );
      setAdminData(getAdminData.data.data.findAdmin);
      setMaxPageAdmin(
        Math.ceil(getAdminData.data.data.findAdminAll.length / rowPerPage)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  let getUserData = async () => {
    const offset = (pageUser - 1) * rowPerPage;
    try {
      let getUserData = await axios.get(
        `http://localhost:8000/admin/userData?offset=${offset}&row=${rowPerPage}&name=${filter.searchUserName}&sort=${sort.sortBy}&sortMode=${sortMode}`
      );
      setUserData(getUserData.data.data.findUser);
      setMaxPageUser(
        Math.ceil(getUserData.data.data.findUserAll.length / rowPerPage)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAdminData();
    renderPageButton();
  }, [pageAdmin, maxPageAdmin, filter, sort, sortMode]);

  useEffect(() => {
    getUserData();
    renderPageButton();
  }, [pageUser, maxPageUser, filter, sort, sortMode]);

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

  const renderAdminData = () => {
    return adminData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.id}</Td>
            <Td>{val.email}</Td>
            <Td>{val.first_name}</Td>
            <Td>{val.last_name}</Td>
            <Td>{val.role === "wh_admin" ? "Warehouse Admin" : "Admin"}</Td>
            <Td>
              {val.role === "admin" ? (
                "-"
              ) : (
                <>{val?.wh_admins[0]?.warehouse?.name}</>
              )}
            </Td>
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
            <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
              <Button
                colorScheme="green"
                size="md"
                onClick={() => handleEdit(val)}
              >
                Edit Profile
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

  let renderUserData = () => {
    return userData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.id}</Td>
            <Td>{val.email}</Td>
            <Td>{val.first_name}</Td>
            <Td>{val.last_name}</Td>
            <Td>{val.role}</Td>
            <Td>
              {val.gender === 1 ? "Male" : val.gender === 2 ? "Female" : "-"}
            </Td>
            <Td>{val.birth_date ? val.birth_date : "-"}</Td>
            <Td>{val.birth_place ? val.birth_place : "-"}</Td>
            <Td>{val.is_verified === 1 ? "Verified" : "Not Verified"}</Td>
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
          </Tr>
        </>
      );
    });
  };

  const nextPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(pageAdmin + 1);
    }
    if (pageUser < maxPageUser) {
      setPageUser(pageUser + 1);
    }
  };
  const prevPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(pageAdmin - 1);
    }
    if (pageUser > 1) {
      setPageUser(pageUser - 1);
    }
  };
  const firstPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(1);
    }
    if (pageUser > 1) {
      setPageUser(1);
    }
  };
  const maxPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(maxPageAdmin);
    }
    if (pageUser < maxPageUser) {
      setPageUser(maxPageUser);
    }
  };

  let renderPageButton = () => {
    return (
      <>
        {adminDataMode ? (
          <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
            <IconButton
              isDisabled={pageAdmin === 1}
              onClick={firstPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="previous page"
              icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
            />
            <IconButton
              isDisabled={pageAdmin === 1}
              onClick={prevPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="previous page"
              icon={<TbChevronLeft color="white" boxsize={"16px"} />}
            />
            <div className="font-ibmReg text-dgrey">
              Page {pageAdmin} / {maxPageAdmin}
            </div>
            <IconButton
              isDisabled={pageAdmin === maxPageAdmin}
              onClick={nextPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="next page"
              icon={<TbChevronRight color="white" boxsize={"16px"} />}
            />
            <IconButton
              isDisabled={pageAdmin === maxPageAdmin}
              onClick={maxPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="next page"
              icon={<TbChevronsRight color="white" boxsize={"16px"} />}
            />
          </div>
        ) : (
          <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
            <IconButton
              isDisabled={pageUser === 1}
              onClick={firstPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="previous page"
              icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
            />
            <IconButton
              isDisabled={pageUser === 1}
              onClick={prevPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="previous page"
              icon={<TbChevronLeft color="white" boxsize={"16px"} />}
            />
            <div className="font-ibmReg text-dgrey">
              Page {pageUser} / {maxPageUser}
            </div>
            <IconButton
              isDisabled={pageUser === maxPageUser}
              onClick={nextPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="next page"
              icon={<TbChevronRight color="white" boxsize={"16px"} />}
            />
            <IconButton
              isDisabled={pageUser === maxPageUser}
              onClick={maxPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="next page"
              icon={<TbChevronsRight color="white" boxsize={"16px"} />}
            />
          </div>
        )}
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
    <>
      <div className="w-[100%]">
        <div className="w-[100%] flex flex-1 justify-between">
          <Sidebar />
          <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
            <div className="w-[1140px] h-auto">
              <Stack spacing={4} direction="row" align="center">
                {adminDataMode ? (
                  <>
                    <Button bg="#5D5FEF" color="white" size="lg">
                      Admin Data
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={changeDataModeToAdmin}
                    color="#5D5FEF"
                    borderColor="#5D5FEF"
                  >
                    Admin Data
                  </Button>
                )}
                {userDataMode ? (
                  <Button bg="#5D5FEF" color="white" size="lg">
                    User Data
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={changeDataModeToUser}
                    color="#5D5FEF"
                    borderColor="#5D5FEF"
                  >
                    User Data
                  </Button>
                )}
                {WHAssignMode ? (
                  <>
                    <Button bg="#5D5FEF" color="white" size="lg">
                      Warehouse Data
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={changeDataModeToWH}
                    color="#5D5FEF"
                    borderColor="#5D5FEF"
                  >
                    Warehouse Data
                  </Button>
                )}
                <></>
              </Stack>
              <div className="w-full h-full mt-[20px]">
                {adminDataMode ? (
                  <>
                    <Text
                      align={["left"]}
                      w="full"
                      className="font-ibmFont"
                      fontSize={30}
                      fontWeight={500}
                    >
                      <Text borderBottom="2px" borderColor="black">
                        <span></span> <span className="text-purple">Admin</span>
                        <span> Data List</span>
                      </Text>
                    </Text>
                    <Button
                      colorScheme="purple"
                      size="md"
                      variant="outline"
                      mt="10px"
                      onClick={onOpenAdd}
                    >
                      <Text>Add Admin Data</Text>
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
                                <Text className="font-ibmReg">
                                  Add Admin Data
                                </Text>
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
                                <option value="wh_admin">
                                  Warehouse Admin
                                </option>
                              </Select>
                            </FormControl>
                            {adminWarehouse ? (
                              <FormControl>
                                <FormLabel>
                                  <Text className="font-ibmMed">
                                    Warehouse Name
                                  </Text>
                                </FormLabel>
                                <Select
                                  ref={warehouseName}
                                  rounded="lg"
                                  variant="filled"
                                  placeholder="Choose Warehouse"
                                  bg="#f5f5f5"
                                  border-1
                                  borderColor={"#D9D9D9"}
                                >
                                  {whOptions.map((val, idx) => {
                                    return <option value={val}>{val}</option>;
                                  })}
                                </Select>
                              </FormControl>
                            ) : (
                              <></>
                            )}
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
                                  <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={handleClick}
                                  >
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
                              Add Admin
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
                                <Text className="font-ibmReg">
                                  Edit Admin Data
                                </Text>
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
                                onChange={(event) =>
                                  setEditEmail(event.target.value)
                                }
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
                                <option value="wh_admin">
                                  Warehouse Admin
                                </option>
                              </Select>
                            </FormControl>
                            {editAdminWarehouse ? (
                              <FormControl>
                                <FormLabel>
                                  <Text className="font-ibmMed">
                                    Warehouse Name
                                  </Text>
                                </FormLabel>
                                <Select
                                  ref={warehouseName}
                                  rounded="lg"
                                  variant="filled"
                                  placeholder="Choose Warehouse"
                                  bg="#f5f5f5"
                                  border-1
                                  borderColor={"#D9D9D9"}
                                  value={editWarehouse}
                                  onChange={(event) => {
                                    setEditWarehouse(event?.target?.value);
                                  }}
                                >
                                  {whOptions.map((val, idx) => {
                                    return <option value={val}>{val}</option>;
                                  })}
                                </Select>
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
                              onClick={editAdmin}
                            >
                              Edit Profile
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
                            name="searchUserName"
                            placeholder="Search by First Name or Last Name"
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
                      <Table variant="simple" w="1000px">
                        <Thead>
                          <Tr className="font-bold bg-[#f1f1f1]">
                            <Th>ID</Th>
                            <Th>Email</Th>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Role</Th>
                            <Th>Warehouse Name</Th>
                            <Th>Created At</Th>
                            <Th className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                              Action
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody className="bg-white">{renderAdminData()}</Tbody>
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
                  </>
                ) : userDataMode ? (
                  <>
                    <Text
                      align={["left"]}
                      w="full"
                      className="font-ibmFont"
                      fontSize={30}
                      fontWeight={500}
                    >
                      <Text borderBottom="2px" borderColor="black">
                        <span></span> <span className="text-purple">User</span>
                        <span> Data List</span>
                      </Text>
                    </Text>
                    <div className="flex justify-between mt-4">
                      <div className="mb-4">
                        <InputGroup>
                          <Input
                            w="350px"
                            name="searchUserName"
                            placeholder="Search by First Name or Last Name"
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
                          <option value="sortGender">Gender</option>
                        </Select>
                        <Button w="100px" ml="20px" onClick={changeSort}>
                          {sortMode === "ASC" ? "A to Z" : "Z to A"}
                        </Button>
                      </div>
                    </div>
                    <TableContainer mt="10px">
                      <Table variant="simple" w="1000px">
                        <Thead>
                          <Tr className="font-bold bg-[#f1f1f1]">
                            <Th>ID</Th>
                            <Th>Email</Th>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Role</Th>
                            <Th>Gender</Th>
                            <Th>Birth Date</Th>
                            <Th>Birth Place</Th>
                            <Th>Verified Status</Th>
                            <Th>Created At</Th>
                          </Tr>
                        </Thead>
                        <Tbody className="bg-white">{renderUserData()}</Tbody>
                      </Table>
                    </TableContainer>
                    {renderPageButton()}
                  </>
                ) : WHAssignMode ? (
                  <>
                    <Box mt={8}>
                      <Heading
                        mb={4}
                        className="font-ibmFont"
                        fontSize={30}
                        fontWeight={500}
                      >
                        Assign Warehouse Admin
                      </Heading>
                      <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel
                              className="font-ibmFont"
                              fontSize={20}
                              fontWeight={500}
                            >
                              Warehouse ID
                            </FormLabel>
                            <Input
                              type="text"
                              width="120px"
                              height="30px"
                              value={warehouseId}
                              onChange={(event) =>
                                setWarehouseId(event.target.value)
                              }
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel
                              className="font-ibmFont"
                              fontSize={20}
                              fontWeight={500}
                            >
                              Warehouse Admin ID
                            </FormLabel>
                            <Input
                              type="text"
                              width="120px"
                              height="30px"
                              value={warehouseAdminId}
                              onChange={(event) =>
                                setWarehouseAdminId(event.target.value)
                              }
                            />
                          </FormControl>

                          <Button
                            type="submit"
                            bg="#5D5FEF"
                            color="white"
                            isLoading={isLoading}
                            alignSelf="flex-start"
                          >
                            Assign
                          </Button>
                        </VStack>
                      </form>
                      <Box mt={8}>
                        <Heading
                          mb={4}
                          className="font-ibmFont"
                          fontSize={20}
                          fontWeight={500}
                        >
                          Admin Data
                        </Heading>
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
                            {userDatax.map((user) => (
                              <Tr key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.first_name}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.role}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                        <Heading
                          mb={4}
                          className="font-ibmFont"
                          fontSize={20}
                          fontWeight={500}
                        >
                          Warehouse Admin List
                        </Heading>
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
                                    const token =
                                      localStorage.getItem("myToken");
                                    try {
                                      await axios.delete(
                                        `http://localhost:8000/admin/delete/${wh.id}`,
                                        { headers: { token } }
                                      );
                                      toast({
                                        title: "Success",
                                        description:
                                          "Warehouse admin deleted successfully",
                                        status: "success",
                                        duration: 5000,
                                        isClosable: true,
                                      });
                                      showAllUserData();
                                    } catch (error) {
                                      console.log(error);
                                      toast({
                                        title: "Error",
                                        description:
                                          "Failed to delete warehouse admin",
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
                      <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
                        {" "}
                        <IconButton
                          isDisabled={pageAdmin === 1}
                          onClick={firstPageHandler}
                          size={"sm"}
                          bg="#5D5FEF"
                          aria-label="previous page"
                          icon={
                            <TbChevronsLeft color="white" boxsize={"16px"} />
                          }
                        />
                        <IconButton
                          isDisabled={pageAdmin === 1}
                          onClick={prevPageHandler}
                          size={"sm"}
                          bg="#5D5FEF"
                          aria-label="previous page"
                          icon={
                            <TbChevronLeft color="white" boxsize={"16px"} />
                          }
                        />
                        <div className="font-ibmReg text-dgrey">
                          Page {pageAdmin} / {maxPageAdmin}
                        </div>
                        <IconButton
                          isDisabled={pageAdmin === maxPageAdmin}
                          onClick={nextPageHandler}
                          size={"sm"}
                          bg="#5D5FEF"
                          aria-label="next page"
                          icon={
                            <TbChevronRight color="white" boxsize={"16px"} />
                          }
                        />
                        <IconButton
                          isDisabled={pageAdmin === maxPageAdmin}
                          onClick={maxPageHandler}
                          size={"sm"}
                          bg="#5D5FEF"
                          aria-label="next page"
                          icon={
                            <TbChevronsRight color="white" boxsize={"16px"} />
                          }
                        />
                      </div>
                    </Box>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default AdminUser;
