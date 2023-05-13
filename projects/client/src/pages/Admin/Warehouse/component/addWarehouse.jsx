import {
  ModalOverlay,
  ModalContent,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Textarea,
  ModalCloseButton,
  useDisclosure,
  Select,
  Modal,
  Checkbox,
  Button,
  VStack,
  Text,
  Heading,
  Box,
} from "@chakra-ui/react";
// import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { data } from "autoprefixer";
import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const AddWarehouse = ({
  isOpen,
  onClose,
  city,
  setCity,
  province,
  setProvince,
  cityList,
  provinceList,
  rakirCity,
  getWarehouse,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(await getWarehouse());
  };

  const onAddWarehouse = async (event) => {
    event.preventDefault();
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
    }
  };
  const getWarehouses = async (city) => {
    let cityName = city.slice(2, city.length);
    console.log(cityName);
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=615ad9702e324d1da084f02d27bc5466`
      );
      let { lat, lng } = res.data.results[0].geometry;
      console.log(`${lat}+${lng}`);
      console.log(res.data.results[0].geometry);
      return lat, lng;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getWarehouses();
  }, []);

  return (
    <>
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
            <form
              onSubmit={
                handleSubmit
                // (onAddAddress)
              }
            >
              <Card maxWidth="300px" className="mt-[30px] ">
                <h1 className="font-ibmBold text-[20px] ">Address Detail</h1>
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
                      // {...register("Province")}
                      onChange={(e) => {
                        rakirCity(e.target.value[0]);
                        setProvince(e.target.value);
                      }}
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
                        getWarehouse(e.target.value);
                        setCity(e.target.value);
                      }}
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
                    {/* {show.loading ? (
                                            <button>
                                                <Spinner aria-label="Default status example" />
                                            </button>
                                        ) : ( */}
                    <Button
                      backgroundColor="#5D5FEF"
                      color="white"
                      mt="5"
                      type="submit"
                      w="265px"
                      h="34px"
                      alignSelf="center"
                      rounded="3xl"
                      onClick={handleSubmit(onAddWarehouse)}
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
    </>
  );
};
