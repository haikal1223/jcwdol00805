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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
  const [adminData, setAdminData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [selectedValue, setSelectedValue] = useState({});
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [pageAdmin, setPageAdmin] = useState(1);
  const [maxPageAdmin, setMaxPageAdmin] = useState(0);
  const [pageUser, setPageUser] = useState(1);
  const [maxPageUser, setMaxPageUser] = useState(0);
  const rowPerPage = 5;

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
  const password = useRef();

  let changeDataMode = () => {
    setAdminDataMode(!adminDataMode);
    setUserDataMode(!userDataMode);
    setPageAdmin(1);
    setMaxPageAdmin(0);
  };

  let getAdminData = async () => {
    const offset = (pageAdmin - 1) * rowPerPage;
    try {
      let getAdminData = await axios.get(
        `http://localhost:8000/admin/adminData?offset=${offset}&row=${rowPerPage}`
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
        `http://localhost:8000/admin/userData?offset=${offset}&row=${rowPerPage}`
      );
      setUserData(getUserData.data.data.findUser);
      setMaxPageUser(
        Math.ceil(getUserData.data.data.findUserAll.length / rowPerPage)
      );
    } catch (error) {
      console.log(error.essage);
    }
  };

  useEffect(() => {
    getAdminData();
    renderPageButton();
  }, [pageAdmin, maxPageAdmin]);

  useEffect(() => {
    getUserData();
    renderPageButton();
  }, [pageUser, maxPageUser]);

  let handleEdit = (val) => {
    setEditEmail(val.email);
    setEditFirstName(val.first_name);
    setEditLastName(val.last_name);
    setEditRole(val.role);
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

  let renderAdminData = () => {
    return adminData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.id}</Td>
            <Td>{val.email}</Td>
            <Td>{val.first_name}</Td>
            <Td>{val.last_name}</Td>
            <Td>{val.role === "wh_admin" ? "Warehouse Admin" : "Admin"}</Td>
            <Td></Td>
            <Td>{val.createdAt}</Td>
            <Td>
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
            <Td>{val.createdAt}</Td>
          </Tr>
        </>
      );
    });
  };

  const nextPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(pageAdmin + 1);
    }
  };
  const prevPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(pageAdmin - 1);
    }
  };
  const firstPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(1);
    }
  };
  const maxPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(maxPageAdmin);
    }
  };

  let renderPageButton = () => {
    return (
      <>
        {adminDataMode ? (
          <div className="w-[100%] mt-5 flex justify-start items-center gap-5">
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
          <div className="w-[100%] mt-5 flex justify-start items-center gap-5">
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

  let addAdmin = async () => {
    try {
      console.log(role);
      let addAdmin = await axios.post("http://localhost:8000/admin/addAdmin", {
        email: email.current.value,
        first_name: firstName.current.value,
        last_name: lastName.current.value,
        role: role.current.value,
        password: password.current.value,
      });
      toast.success(addAdmin.data.message);
      email.current.value = "";
      firstName.current.value = "";
      lastName.current.value = "";
      password.current.value = "";
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  let editAdmin = async () => {
    try {
      console.log(editRole);
      let editAdmin = await axios.patch(
        "http://localhost:8000/admin/editAdmin",
        {
          email: editEmail,
          first_name: editFirstName,
          last_name: editLastName,
          role: editRole,
        }
      );
      console.log(editAdmin);
      toast.success(editAdmin.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.response);
    }
  };

  return (
    <div className="w-[100%]">
      <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
          <div className="w-[1500px] h-[1800px]">
            <Stack spacing={4} direction="row" align="center">
              {adminDataMode ? (
                <Button bg="#5D5FEF" color="white" size="lg">
                  Admin Data
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={changeDataMode}
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
                  onClick={changeDataMode}
                  color="#5D5FEF"
                  borderColor="#5D5FEF"
                >
                  User Data
                </Button>
              )}
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
                  <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
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
                            >
                              <option value="admin">admin</option>
                              <option value="wh_admin">warehouse admin</option>
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
                  <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
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
                              onChange={(event) =>
                                setEditRole(event.target.value)
                              }
                            >
                              <option value="admin">admin</option>
                              <option value="wh_admin">warehouse admin</option>
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
                            Edit Profile
                          </Button>
                        </VStack>
                      </Box>
                    </ModalContent>
                  </Modal>
                  <TableContainer mt="10px">
                    <Table variant="striped" colorScheme="gray" w="1000px">
                      <Thead bg="#5D5FEF">
                        <Tr>
                          <Th color="white">ID</Th>
                          <Th color="white">Email</Th>
                          <Th color="white">First Name</Th>
                          <Th color="white">Last Name</Th>
                          <Th color="white">Role</Th>
                          <Th color="white">Warehouse Location</Th>
                          <Th color="white">Created At</Th>
                          <Th color="white">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{renderAdminData()}</Tbody>
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
                  <TableContainer mt="10px">
                    <Table variant="striped" colorScheme="gray" w="1000px">
                      <Thead bg="#5D5FEF">
                        <Tr>
                          <Th color="white">ID</Th>
                          <Th color="white">Email</Th>
                          <Th color="white">First Name</Th>
                          <Th color="white">Last Name</Th>
                          <Th color="white">Role</Th>
                          <Th color="white">Gender</Th>
                          <Th color="white">Birth Date</Th>
                          <Th color="white">Birth Place</Th>
                          <Th color="white">Verified Status</Th>
                          <Th color="white">Created At</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{renderUserData()}</Tbody>
                    </Table>
                  </TableContainer>
                  {renderPageButton()}
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
  );
};

export default AdminUser;
