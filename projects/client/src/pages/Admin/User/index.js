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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";

const AdminUser = () => {
  const [adminDataMode, setAdminDataMode] = useState(true);
  const [userDataMode, setUserDataMode] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [userData, setUserData] = useState([]);

  let changeDataMode = () => {
    setAdminDataMode(!adminDataMode);
    setUserDataMode(!userDataMode);
  };

  let getAdminData = async () => {
    try {
      let getAdminData = await axios.get(
        "http://localhost:8000/admin/adminData"
      );
      setAdminData(getAdminData.data.data);
    } catch (error) {}
  };

  let getUserData = async () => {
    try {
      let getUserData = await axios.get("http://localhost:8000/admin/userData");
      setUserData(getUserData.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getAdminData();
    getUserData();
  }, []);

  let renderAdminData = () => {
    return adminData.map((val, idx) => {
      return (
        <>
          <Tr>
            <Td>{val.email}</Td>
            <Td>{val.first_name}</Td>
            <Td>{val.last_name}</Td>
            <Td>{val.role}</Td>
            <Td>{val.created_at}</Td>
            <Td>text</Td>
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
            <Td>{val.email}</Td>
            <Td>{val.first_name}</Td>
            <Td>{val.last_name}</Td>
            <Td>{val.role}</Td>
            <Td>
              {val.gender === 1 ? "Male" : val.gender === 2 ? "Female" : "-"}
            </Td>
            <Td>{val.birth_date ? val.birth_date : "-"}</Td>
            <Td>{val.birth_place ? val.birth_place : "-"}</Td>
            <Td>{val.is_verified === 1 ? "Yes" : "No"}</Td>
            <Td>{val.created_at}</Td>
            <Td>text</Td>
          </Tr>
        </>
      );
    });
  };

  return (
    <div className="w-[100%]">
      <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
          <div className="w-[1500px] h-[1800px]">
            <Stack spacing={4} direction="row" align="center">
              {adminDataMode ? (
                <Button colorScheme="purple" size="lg">
                  Admin Data
                </Button>
              ) : (
                <Button
                  colorScheme="purple"
                  size="lg"
                  variant="outline"
                  onClick={changeDataMode}
                >
                  Admin Data
                </Button>
              )}
              {userDataMode ? (
                <Button colorScheme="purple" size="lg">
                  User Data
                </Button>
              ) : (
                <Button
                  colorScheme="purple"
                  size="lg"
                  variant="outline"
                  onClick={changeDataMode}
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
                  <TableContainer mt="10px">
                    <Table variant="simple" w="1000px">
                      <Thead>
                        <Tr>
                          <Th>Email</Th>
                          <Th>First Name</Th>
                          <Th>Last Name</Th>
                          <Th>Role</Th>
                          <Th>Created At</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{renderAdminData()}</Tbody>
                    </Table>
                  </TableContainer>
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
                    <Table variant="simple" w="1000px">
                      <Thead>
                        <Tr>
                          <Th>Email</Th>
                          <Th>First Name</Th>
                          <Th>Last Name</Th>
                          <Th>Role</Th>
                          <Th>Gender</Th>
                          <Th>Birth Date</Th>
                          <Th>Birth Place</Th>
                          <Th>Verified User?</Th>
                          <Th>Created At</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{renderUserData()}</Tbody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
