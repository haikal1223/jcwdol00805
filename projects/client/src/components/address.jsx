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
import { Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { data } from "autoprefixer";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Address(props) {
    const Navigate = useNavigate();
    const [rakir, setRakir] = useState({
        main_address: false,
    });

    const [uid, setUid] = useState('')
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState([]);
    const [city, setCity] = useState([]);
    const [xCity, setxCity] = useState([]);
    const [allAddress, setAllAddress] = useState([]);
    const [mainAddress, setMainAddress] = useState({});
    const [show, setShow] = useState({
        changeAddress: false,
        addNewAddress: false,
        loading: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const modalAddress = useDisclosure();
    const modalSwitch = useDisclosure();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onAddAddress = async (data) => {
        setShow({ ...show, loading: true });
        let token = localStorage.getItem("myToken");
        try {
            let postAddress = await axios.post(
                `http://localhost:8000/address/addAddress`,

                {
                    main_address: rakir.main_address,
                    street_address: data.street_address,
                    subdistrict: data.subdistrict,
                    city: data.city,
                    province: data.province,
                    recipient_name: data.recipient_name,
                    recipient_phone: data.recipient_phone,
                    postal_code: data.postal_code,
                    uid,
                },

            );

            setAddress(postAddress);
            toast.success("Address Added");
        } catch (error) {
            console.log(error);
        } finally {
            setShow({ ...show, loading: false });
            Navigate(0);
            modalAddress.onClose();
        }
    };

    const rakirCity = async (province_id) => {
        try {
            let data = await axios.get(
                `http://localhost:8000/address/getCity?province_id=${province_id}`,
                {
                    headers: {
                        key: "1c7c205702353d15cd449b7b8e07d22a",
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
                `http://localhost:8000/address/getProvince`,
                {
                    headers: {
                        key: "1c7c205702353d15cd449b7b8e07d22a",
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
            let token = localStorage.getItem("myToken");
            let response = await axios.get(
                `http://localhost:8000/user/verifytoken?token=${token}`
            );
            setUid(response.data.data.uid);
            if (uid) {
                let getAddress = await axios.get(
                    `http://localhost:8000/address/getAddress?uid=${uid}`
                );
                setAllAddress(getAddress.data.data);
                const main = getAddress.data.data.filter(
                    (e) => e.main_address === true
                );
                console.log(main[0])
                if (!main) {
                    setMainAddress("");
                } else {
                    setMainAddress(main[0]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAddress();
    }, [uid]);

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
            let data = await axios.patch(
                `http://localhost:8000/address/defaultAddress/${id}`,
                {},
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setRakir({ ...rakir, main_address: true });
            toast.success("Main Address Changed");
        } catch (error) {
            console.log(error);
        } finally {
            Navigate(0);
        }
    };


    useEffect(() => {
        rakirCity();
        rakirProvince();
        getAddress();
    }, []);

    return (
        <>


            <Button
                rounded="lg"
                w={["full"]}
                alignSelf="center"
                backgroundColor="#5D5FEF"
                color="white"
                className="font-ibmFont"
                onClick={onOpen}>
                +Add Address
            </Button>

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
                                                        {val.type} {val.city_name}
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


        </>
    );
}