import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  useDisclosure,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  ModalCloseButton,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

export default function AdminWarehouse() {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cityList, setCityList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [allWarehouse, setAllWarehouse] = useState([]);
  const [filteredWarehouse, setFilteredWarehouse] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const rowPerPage = 10;
  const [show, setShow] = useState({
    onAddWarehouse: false,
    loading: false,
  });
  const Navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    handleSubmit,
    formState: {},
  } = useForm();

  const getWarehouse = async (city) => {
    let cityName = city.slice(2, city.length);
    console.log(cityName);
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=615ad9702e324d1da084f02d27bc5466`
      );
      let { lat, lng } = res.data.results[0].geometry;
      console.log(`${lat}+${lng}`);
      console.log(res.data.results[0].geometry);
      return { lat, lng };
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchWarehouse = async () => {
    const offset = (page - 1) * rowPerPage;
    let token = Cookies.get("adminToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/warehouse/all-warehouse`,
        {
          headers: { token: token },
        }
      );
      setAllWarehouse(response.data.data);
      setMaxPage(Math.ceil(filteredWarehouse.length / rowPerPage));
      if (response.data.data.length === 0) {
        toast.error("WareHouse Not found");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // get city & province

  const rakirProvince = async () => {
    try {
      let data = await axios.get(
        `http://localhost:8000/cart/rajaongkir-province`,
        {
          headers: {
            key: "98114927956fc9abdce23deeef6cfb17",
          },
        }
      );
      setProvinceList(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const rakirCity = async (province_id) => {
    try {
      let data = await axios.get(
        `http://localhost:8000/cart/rajaongkir-city?province_id=${province_id}`,
        {
          headers: {
            key: "98114927956fc9abdce23deeef6cfb17",
          },
        }
      );
      setCityList(data.data.data.rajaongkir.city);
    } catch (error) {
      console.log(error);
    }
  };

  const renderWarehouse = () => {
    const startIndex = (page - 1) * rowPerPage;
    const endIndex = startIndex + rowPerPage;
    const currentWarehouse = allWarehouse.slice(startIndex, endIndex);
    return currentWarehouse.map((warehouse, index) => {
      return (
        <Tr key={index}>
          <Td>{warehouse.id}</Td>
          <Td>{warehouse.name}</Td>
          <Td>{warehouse.city.split(".")[1]}</Td>
          <Td>{warehouse.province.split(".")[1]}</Td>
          <Td>{warehouse.lat}</Td>
          <Td>{warehouse.lng}</Td>
          <Td>{warehouse.createdAt}</Td>
          <Td>{warehouse.updatedAt}</Td>
        </Tr>
      );
    });
  };

  const onAddWarehouse = async (event) => {
    setShow({ ...show, loading: true });
    const name = document.getElementById("name").value;
    const city = document.getElementById("city").value;
    const province = document.getElementById("province").value;
    const { lat, lng } = await getWarehouse(city);
    const payload = {
      name,
      city,
      province,
      lat,
      lng,
    };
    let token = Cookies.get("adminToken");
    try {
      const response = await axios.post(
        "http://localhost:8000/warehouse/add-warehouse",
        payload,
        {
          headers: { token },
        }
      );
      toast.success("Warehouse added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add warehouse.");
      console.error(error);
    } finally {
      setShow({ ...show, loading: false });
      Navigate(0);
      onClose();
    }
  };

  const filterWarehouse = (searchTerm) => {
    return allWarehouse.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  // search, sort & filter

  useEffect(() => {
    fetchWarehouse();
  }, [page, searchTerm, filteredWarehouse.length]);

  useEffect(() => {
    const filteredList = filterWarehouse(searchTerm);
    setFilteredWarehouse(filteredList);
  }, [filteredWarehouse]);

  useEffect(() => {
    rakirCity();
    rakirProvince();
    getWarehouse();
  }, []);

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

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          {/*REPLACE BELOW FOR CONTENT*/}
          <Box className="bg-white w-full h-[1100px] drop-shadow-md p-9">
            <div className="flex flex-row justify-between align-center">
              <Text className="font-ibmMed text-4xl">Warehouse</Text>
              <Button
                rounded="lg"
                w={["35"]}
                alignSelf="center"
                backgroundColor="#5D5FEF"
                color="white"
                className="font-ibmFont"
                onClick={onOpen}
              >
                +Add Warehouse
              </Button>
            </div>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isCentered
              motionPreset="slideInBottom"
              className="z-50"
              popup={true}
            >
              <ModalOverlay
                bg="blackAlpha.200"
                backdropFilter="blur(10px) hue-rotate(90deg)"
              />
              <ModalContent alignItems="center">
                <ModalCloseButton />
                <>
                  <form onSubmit={handleSubmit(onAddWarehouse)}>
                    <Card maxWidth="300px" className="mt-[30px] ">
                      <h1 className="font-ibmBold text-[20px] ">
                        Address Detail
                      </h1>
                      <CardBody>
                        <FormControl>
                          <FormLabel size="sm">Name</FormLabel>
                          <Input
                            type="text"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder="Name"
                            id="name"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">Province</FormLabel>
                          <Select
                            name="province"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            onChange={(e) => {
                              rakirCity(e.target.value[0]);
                              setProvince(e.target.value);
                            }}
                            id="province"
                          >
                            <option value="">Select Province</option>
                            {provinceList?.map((val, idx) => {
                              return (
                                <option
                                  value={`${val.province_id}.${val.province}`}
                                  key={idx}
                                >
                                  {val.province}
                                </option>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">City</FormLabel>
                          <Select
                            name="city"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            onChange={(e) => {
                              setCity(e.target.value);
                            }}
                            id="city"
                          >
                            <option value="selected">Select City</option>
                            {cityList.map((val, idx) => {
                              return (
                                <option
                                  value={`${val.city_id}.${val.city_name}`}
                                  key={idx}
                                >
                                  {val.type + " " + val.city_name}
                                </option>
                              );
                            })}
                          </Select>
                        </FormControl>

                        <div className="w-full flex justify-end">
                          <Button
                            backgroundColor="#5D5FEF"
                            color="white"
                            mt="5"
                            type="submit"
                            w="265px"
                            h="34px"
                            alignSelf="center"
                            rounded="3xl"
                          >
                            Save Address
                          </Button>
                          {/* )} */}
                        </div>
                      </CardBody>
                    </Card>
                  </form>
                </>
              </ModalContent>
            </Modal>

            <hr className="my-4 border-[2px]" />
            <HStack justifyContent={"space-between"} className="mb-4"></HStack>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr className="font-bold bg-[#f1f1f1]">
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>City</Th>
                    <Th>Province</Th>
                    <Th>lat</Th>
                    <Th>lng</Th>
                    <Th>Created At</Th>
                    <Th>update At</Th>
                    <Td className="flex justify-center w-[250px] sticky right-0 z-50 bg-[#f1f1f1] shadow-[-10px_0px_30px_0px_#efefef]">
                      action
                    </Td>
                  </Tr>
                </Thead>
                <Tbody className="bg-white">{renderWarehouse()}</Tbody>
              </Table>
            </TableContainer>

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
}
