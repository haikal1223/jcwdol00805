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
  Text,
  Image,
  Box,
  calc,
} from "@chakra-ui/react";
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function CheckOut(props) {
  const Navigate = useNavigate();
  const [rakir, setRakir] = useState({
    main_address: false,
  });

  const [id, setId] = useState("");
  const [cartId, setCartId] = useState([]);
  const [getWHid, setgetWHid] = useState([]);
  const [useraddressid, setuseraddressid] = useState([]);
  const [data, setData] = useState([]);
  const [cost, setCost] = useState(0);
  const [origin, setorigin] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [destination, setdestination] = useState(0);
  const [JNE, setJNE] = useState();
  const [POS, setPOS] = useState();
  const [TIKI, setTIKI] = useState();
  const [weight, setweight] = useState(0);
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [cart, setCart] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [mainAddress, setMainAddress] = useState({});
  const [show, setShow] = useState({
    changeAddress: false,
    addNewAddress: false,
    loading: false,
  });
  const [render, setRender] = useState(true);
  const [cord, setCord] = useState({
    lat: 0,
    lng: 0,
  });

  const {
    register,
    handleSubmit,
    formState: {},
    setValue,
  } = useForm();

  const modalAddress = useDisclosure();
  const modalSwitch = useDisclosure();

  const getId = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setId(response?.data?.data?.id);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onAddAddress = async (data) => {
    setShow({ ...show, loading: true });
    let token = localStorage.getItem("myToken");
    try {
      let postAddress = await axios.post(
        `http://localhost:8000/cart/new-address`,

        {
          main_address: rakir.main_address,
          street_address: data.street_address,
          subdistrict: data.subdistrict,
          city: data.city,
          province: data.province,
          recipient_name: data.recipient_name,
          recipient_phone: data.recipient_phone,
          postal_code: data.postal_code,
        },
        {
          headers: { token: token },
        }
      );
      toast.success("Address Added");
    } catch (error) {
      console.log(error);
    } finally {
      setShow({ ...show, loading: false });
      setRender(!render);
      modalAddress.onClose();
    }
  };

  const rakirCity = async (province_id) => {
    try {
      let data = await axios.get(
        `http://localhost:8000/cart/rajaongkir-city?province_id=${province_id}`,
        {
          headers: {
            key: "98114927956fc9abdce23deeef6cfb17  ",
          },
        }
      );
      setCity(data.data.data.rajaongkir.city);
    } catch (error) {
      console.log(error);
    }
  };

  const rakirProvince = async () => {
    try {
      let data = await axios.get(
        `http://localhost:8000/cart/rajaongkir-province`,
        {
          headers: {
            key: "98114927956fc9abdce23deeef6cfb17  ",
          },
        }
      );
      setProvince(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAddress = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(`http://localhost:8000/cart/get-address`, {
        headers: {
          token: token,
        },
      });
      setAllAddress(response.data.data);
      const main = response.data.data.filter((e) => e.main_address === true);
      if (!main) {
        setMainAddress("");
      } else {
        setMainAddress(main[0]);
      }
      setdestination(main[0].city.split(".")[0]);
      setuseraddressid(main[0].id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCord = async () => {
    let openCage = await axios.get(
      `http://localhost:8000/address/open-cage?city=${
        mainAddress.city.split(".")[1]
      }&province=${mainAddress.province.split(".")[1]}`
    );
    setCord({
      ...cord,
      lat: openCage.data.data.lat,
      lng: openCage.data.data.lng,
    });
  };

  const splitText = (text) => {
    if (text) {
      return text.split(".")[1];
    } else {
      return "";
    }
  };

  const defaultAddress = async (id) => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.patch(
        `http://localhost:8000/cart/main-address/${id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );
      setRakir({ ...rakir, main_address: true });
      setdestination(0);
      toast.success("Main Address Changed");
    } catch (error) {
      console.log(error);
    } finally {
      setRender(!render);
    }
  };

  const deleteAddress = async (id) => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.delete(
        `http://localhost:8000/cart/delete-address/${id}`,
        {
          headers: { token: token },
        }
      );
      toast.success("address deleted");
    } catch (error) {
      console.log(error);
    } finally {
      setRender(!render);
    }
  };

  let getUserCart = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.get(
        `http://localhost:8000/cart/checkout?user_id=${id}`,
        {
          headers: { token: token },
        }
      );
      if (response.data.data.findUserCart.length === 0) {
        return (
          <>
            {setTimeout(() => Navigate("/cart"), 2000)}
            {toast.error(
              "Your checkout is empty. We will send you back to your Cart",
              {
                id: "no_checkout",
                duration: 2000,
              }
            )}
          </>
        );
      }
      let item_weight = 0;
      response.data.data.findUserCart.forEach((v, i) => {
        item_weight = v.quantity * 1000;
      });
      setweight(item_weight);
      setCart(response.data.data.findUserCart);
      setCartId(response.data.data.cartId);

      // need improvement later by checking nearest WH

      /* setorigin(response.data.data.findUserCart[0].product.product_stocks[0].warehouse.city.split(".")[0]);
      setgetWHid(response.data.data.findUserCart[0].product.product_stocks[0].warehouse_id); */
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  };

  // const getCourier = async () => {
  //   setdisable(true);
  //   let token = localStorage.getItem("myToken");

  //   try {
  //     let cost = await axios.post(
  //       "http://localhost:8000/courier/cost",
  //       {
  //         origin: origin,
  //         destination: destination,
  //         weight: weight,
  //         courier: shippingMethod,
  //       },
  //       {
  //         headers: {
  //           token: token,
  //           key: "98114927956fc9abdce23deeef6cfb17  ",
  //         },
  //       }
  //     );
  //     setCost(cost.data.data[0].costs);
  //     setTimeout(() => {
  //       setdisable(false);
  //     }, 1000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleShippingMethodChange = (event) => {
    setShippingMethod(event.target.value);
  };

  const calculateShippingCost = async () => {
    let token = localStorage.getItem("myToken");
    try {
      let response = await axios.post(
        `http://localhost:8000/courier/cost`,
        {
          origin: origin,
          destination: destination,
          weight: weight,
          courier: shippingMethod,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      console.log(response.data.data[0].costs);
      if (response.data.data[0].costs.length !== 0) {
        setShippingCost(response.data.data[0].costs[0].cost[0].value);
      } else {
        toast.error("Courier not available in your area");
        setShippingCost(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createOrder = async () => {
    try {
      // get value

      // post order
      let token = localStorage.getItem("myToken");
      if (shippingMethod === "" || shippingCost === 0) {
        toast.error("Please select shipping method first");
      } else {
        await axios.post(
          `http://localhost:8000/order/create-order?paid_amt=${getTotalPrice()}&address=${useraddressid}&ship_cost=${shippingCost}&uid=${id}&whid=${getWHid}`,
          {
            cartId: cartId,
          },
          { headers: { token: token } }
        );

        toast.success("Order successfully placed", { duration: 3000 });
        window.location.href = "/order";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const nearestWh = async () => {
    try {
      if (cord.lat) {
        let response = await axios.get(
          `http://localhost:8000/cart/nearest-wh?lat=${cord.lat}&lng=${cord.lng}`
        );
        console.log(response);
        setgetWHid(response.data.data[0].id);
        setorigin(response.data.data[0].city.split(".")[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(cord);

  useEffect(() => {
    getId();
    rakirCity();
    rakirProvince();
    getAddress();
  }, []);

  useEffect(() => {
    getUserCart();
  }, [id]);

  useEffect(() => {
    calculateShippingCost();
  }, [shippingMethod]);

  useEffect(() => {
    getAddress();
  }, [render]);

  useEffect(() => {
    calculateShippingCost();
  }, [origin]);

  useEffect(() => {
    calculateShippingCost();
  }, [useraddressid]);

  useEffect(() => {
    fetchCord();
  }, [mainAddress]);

  useEffect(() => {
    nearestWh();
  }, [cord]);

  return (
    <>
      <Box
        w={"100%"}
        justifyContent={"space-between"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"space-between"}
        pt={"5"}
        pb={"10"}
      >
        <div className=" mt-[15px] pl-[24px] ">
          <div className="border-b-2">
            <h1 className="font-ibmBold">CheckOut</h1>
          </div>
          <Box>
            <Box>
              {cart.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  mb="4"
                  mt="5"
                >
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    boxSize="84px"
                    objectFit="contain"
                    mr="4"
                    border="1px solid gray"
                  />
                  <Box>
                    <Text className=" font-ibmMed">{item.product.name}</Text>
                    <Text className=" font-ibmReg" align="left">
                      Price:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.price)}{" "}
                      * {item.quantity}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {mainAddress !== "" ? (
            <>
              <div className="flex items-center align-middle justify-between border-2 border-gray-300 rounded-lg p-4 mt-5">
                <div>
                  <p className="text-sm font-bold font-ibmMed">
                    {mainAddress?.recipient_name}
                  </p>
                  <p className="text-sm font-ibmReg">
                    {mainAddress?.recipient_phone}
                  </p>
                  <p className="text-sm font-ibmReg">
                    {mainAddress?.street_address}
                  </p>
                  <p className="text-sm font-ibmReg">
                    {mainAddress?.subdistrict}, {splitText(mainAddress?.city)},{" "}
                    {splitText(mainAddress?.province)}
                  </p>
                  <p className="text-sm font-ibmReg">
                    {mainAddress?.postal_code}
                  </p>
                </div>

                <Button
                  w="120px"
                  h="34px"
                  border="1px solid #5D5FEF"
                  color="#5D5FEF"
                  borderRadius="3px"
                  className="font-ibmFontRegular"
                  onClick={modalSwitch.onOpen}
                  onClose={modalSwitch.onClose}
                >
                  Switch
                </Button>
              </div>
              <Modal
                isOpen={modalSwitch.isOpen}
                onClose={modalSwitch.onClose}
                isCentered
                w="300px"
                motionPreset="slideInBottom"
                className="z-50"
                popup={true}
              >
                <ModalOverlay
                  bg="blackAlpha.200"
                  backdropFilter="blur(10px) hue-rotate(90deg)"
                />
                <ModalContent
                  alignItems="center"
                  overflowY="scroll"
                  maxHeight="400px"
                >
                  <ModalCloseButton />
                  {allAddress?.map((v, i) => (
                    <div
                      className="flex items-center align-middle justify-between p-10 flex-row"
                      style={{ width: "100%" }}
                      key={i}
                    >
                      <div>
                        <p className="text-sm font-bold font-ibmMed">
                          {v?.recipient_name}
                        </p>
                        <p className="text-sm font-bold font-ibmMed">
                          {v?.recipient_phone}
                        </p>
                        <p className="text-sm font-bold font-ibmMed">
                          {v?.street_address}
                        </p>
                        <p className="text-sm font-bold font-ibmMed">
                          {v?.subdistrict}, {splitText(v?.city)},{" "}
                          {splitText(v?.province)}
                        </p>
                        <p className="text-sm font-bold font-ibmMed">
                          {mainAddress?.postal_code}
                        </p>
                      </div>
                      <div className=" flex flex-col p-2 justify-between">
                        <Button
                          w="80px"
                          h="34px"
                          border="1px solid #5D5FEF"
                          color="#5D5FEF"
                          borderRadius="3px"
                          className="font-ibmFontRegular"
                          onClick={() => {
                            defaultAddress(v?.id);
                            modalSwitch.onClose();
                          }}
                        >
                          Switch
                        </Button>
                        <Button
                          w="80px"
                          h="34px"
                          border="1px solid #5D5FEF"
                          color="#5D5FEF"
                          borderRadius="3px"
                          className="font-ibmFontRegular"
                          onClick={() => {
                            deleteAddress(v?.id);
                            modalSwitch.onClose();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </ModalContent>
              </Modal>
            </>
          ) : (
            <></>
          )}

          <div className="flex justify-center mt-[18px]">
            <Button
              w="325px"
              h="34px"
              border="1px solid #5D5FEF"
              color="#5D5FEF"
              borderRadius="3px"
              className="font-ibmFontRegular"
              onClick={modalAddress.onOpen}
              onClose={modalAddress.onClose}
            >
              +add new address
            </Button>

            <Modal
              isOpen={modalAddress.isOpen}
              onClose={modalAddress.onClose}
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
                  <form onSubmit={handleSubmit(onAddAddress)}>
                    <Card maxWidth="300px" className="mt-[30px] ">
                      <h1 className="font-ibmBold text-[20px] ">
                        Address Detail
                      </h1>
                      <CardBody>
                        <FormControl>
                          <FormLabel size="sm">Recepient Name</FormLabel>
                          <Input
                            type="text"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder=""
                            {...register("recipient_name")}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">Phone Number</FormLabel>
                          <Input
                            type="text"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder=""
                            {...register("recipient_phone")}
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
                              rakirCity(e.target.value);
                              setValue("province", e.target.value);
                            }}
                          >
                            <option value="">Select Province</option>
                            {province?.map((val, idx) => {
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
                            {...register("city")}
                            onChange={(e) => setValue("xCity", e.target.value)}
                          >
                            <option value="selected">Select City</option>
                            {city.map((val, idx) => {
                              return (
                                <option
                                  value={`${val.city_id}.${val.city_name}`}
                                  key={idx}
                                >
                                  {val.city_name}
                                </option>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">Subdistrict</FormLabel>
                          <Input
                            type="text"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder=""
                            {...register("subdistrict")}
                            required={true}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">Street Address</FormLabel>
                          <Textarea
                            type="text-area"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder=""
                            {...register("street_address")}
                            required={true}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel size="sm">Postal Code</FormLabel>
                          <Input
                            type="text"
                            bg="white"
                            borderColor="#d8dee4"
                            size="sm"
                            borderRadius="6px"
                            placeholder=""
                            {...register("postal_code")}
                          />
                        </FormControl>
                        <div className="flex items-center gap-2 mt-[20px]">
                          <Checkbox
                            id="remember"
                            onChange={() =>
                              setRakir({
                                ...rakir,
                                main_address: rakir.main_address ? false : true,
                              })
                            }
                          />
                          <Label htmlFor="remember" className="font-ibmBold">
                            Main Address
                          </Label>
                        </div>
                        <div className="w-full flex justify-end">
                          {show.loading ? (
                            <button>
                              <Spinner aria-label="Default status example" />
                            </button>
                          ) : (
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
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </form>
                </>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-row",
            alignItems: "end",
            justifyContent: "space-between",
            paddingBottom: "14px",
          }}
        >
          <label
            htmlFor="shipping-method"
            style={{ marginRight: "8px", textAlign: "left", fontSize: "14px" }}
            className="font-ibmReg"
          >
            Shipping Method
          </label>
          <select
            value={shippingMethod}
            onChange={handleShippingMethodChange}
            style={{
              width: "200px",
              height: "30px",
              marginTop: "15px",
            }}
          >
            <option value=""></option>
            <option
              value="jne"
              className="font-ibmReg"
              style={{ fontSize: "14px" }}
            >
              JNE
            </option>
            <option
              value="pos"
              className="font-ibmReg"
              style={{ fontSize: "14px" }}
            >
              POS
            </option>
            <option
              value="tiki"
              className="font-ibmReg"
              style={{ fontSize: "14px" }}
            >
              TIKI
            </option>
          </select>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "14px",
          }}
        >
          <span
            htmlFor="shipping-cost"
            style={{ marginRight: "8px", textAlign: "left", fontSize: "14px" }}
            className="font-ibmReg"
          >
            Shipping Cost
          </span>
          <span style={{ marginLeft: "auto" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(shippingCost)}
          </span>
        </div>

        <div className="border-b-2 mt-8"></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "14px",
          }}
        >
          <span
            htmlFor="shipping-cost"
            style={{ marginRight: "8px", textAlign: "left", fontSize: "20px" }}
            className="font-ibmBold"
          >
            Grand Total
          </span>
          <span style={{ marginLeft: "auto", fontSize: "20px" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(getTotalPrice() + shippingCost)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "-2px",
          }}
        >
          <Button
            rounded="3xl"
            w="248px"
            h="40px"
            backgroundColor="#5D5FEF"
            color="white"
            mt="5"
            type="button"
            isDisabled={shippingMethod === "" || shippingCost === 0}

            _disabled={{ bg: '#D9D9D9', color: '#9AA0B4', border: '0px', _hover: { bg: '#D9D9D9', color: '#9AA0B4', border: '0px' } }}

            onClick={() => createOrder()}
          >
            <Text className=" font-ibmFontRegular">Create Order</Text>
          </Button>
        </div>
      </Box>
    </>
  );
}
