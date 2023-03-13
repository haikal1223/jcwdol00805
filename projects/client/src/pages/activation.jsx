import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Icon,
  InputGroup,
  InputRightElement,
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import "../App.css";
import HeaderPattern from "../assets/img/homepage/HeaderPattern.svg";

export default function Activation() {
  const [message, setMessage] = useState(
    "Password should be of minimum 8 character length and must contain lowercase, uppercase, number, and special character."
  );
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uidUser, setUidUser] = useState("");

  let password = useRef();
  let location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  let getData = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8000/user/verification${location.search}`
      );
      setFirstName(response.data.data[0].first_name);
      setEmail(response.data.data[0].email);
      setVerified(response.data.data[0].is_verified);
      setUidUser(response.data.data[0].uid);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  });

  let validatePassword = (val) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!regex.test(val)) {
      if (val.length < 8) {
        setMessage(
          "Password should be of minimum 8 character length and must contain lowercase, uppercase, number, and special character."
        );
      } else {
        setMessage(
          "Password must contain lowercase, uppercase, number, and special character."
        );
      }
    } else {
      if (val.length < 8) {
        setMessage("Password should be of minimum 8 character length.");
      } else {
        setMessage("");
      }
    }
  };

  let handlePassword = async () => {
    try {
      setIsLoading(true);
      let inputPassword = password.current.value;
      if (inputPassword.length < 8)
        throw { message: "Password should be of minimum 8 character length." };

      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!regex.test(inputPassword))
        throw {
          message:
            "Password must contain lowercase, uppercase, number, and special character.",
        };

      await axios.patch(`http://localhost:8000/user/verification/${uidUser}`, {
        password: inputPassword,
      });
      toast({
        title: "Register Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setMessage("");
      navigate("/login");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  let navigateLogin = () => {
    navigate("/login");
  };

  let navigateRegister = () => {
    navigate("/register");
  };

  return (
    <>
      {firstName && verified == 0 ? (
        <Box
          w={[480]}
          h={["full"]}
          p={[0, 0]}
          mx="auto"
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"between"}
        >
          <Image src={HeaderPattern} w="full"></Image>
          <VStack spacing={4} align="flex-start" w="full">
            <VStack spacing={1} align={["flex-start", "left"]} w="full">
              <Heading>
                <Text mt="50" className="font-ibmFont">
                  One More Step, {firstName}!
                </Text>
              </Heading>
            </VStack>
            <FormControl>
              <FormLabel>
                <Text className="font-ibmFont">E-mail</Text>
              </FormLabel>
              <Input
                rounded="lg"
                variant="filled"
                placeholder={`${email}`}
                isDisabled="true"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                <Text className="font-ibmFont">Password</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  rounded="lg"
                  variant="filled"
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  ref={password}
                  onChange={(e) => validatePassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Text color="red">{message}</Text>
            <Button
              rounded="lg"
              w={["30vh"]}
              alignSelf="center"
              backgroundColor="#5D5FEF"
              color="white"
              className="font-ibmFont"
              onClick={handlePassword}
            >
              {isLoading ? <Spinner /> : "Register"}
            </Button>
          </VStack>
        </Box>
      ) : (
        <Box
          w={[480]}
          h={["full"]}
          p={[0, 0]}
          mx="auto"
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"between"}
        >
          <Image src={HeaderPattern} w="full"></Image>
          <Heading w="full">
            {verified == 1 ? (
              <>
                <Text mt="50" className="font-ibmFont" fontSize={"4xl"}>
                  Error 404
                </Text>
                <Text fontSize={"xl"}>Your account has been verified!</Text>
                <HStack mt="30">
                  <Button
                    rounded="lg"
                    w="full"
                    alignSelf="center"
                    backgroundColor="#5D5FEF"
                    color="white"
                    className="font-ibmFont"
                    onClick={navigateLogin}
                  >
                    Login
                  </Button>
                </HStack>
              </>
            ) : (
              <>
                <Text mt="50" className="font-ibmFont" fontSize={"4xl"}>
                  Error 404
                </Text>
                <Text fontSize={"xl"}>Account is not found</Text>
                <HStack mt="30">
                  <Button
                    rounded="lg"
                    w="full"
                    alignSelf="center"
                    backgroundColor="#5D5FEF"
                    color="white"
                    className="font-ibmFont"
                    onClick={navigateRegister}
                  >
                    Register
                  </Button>
                  <Button
                    rounded="lg"
                    w="full"
                    alignSelf="center"
                    backgroundColor="#5D5FEF"
                    color="white"
                    className="font-ibmFont"
                    onClick={navigateLogin}
                  >
                    Login
                  </Button>
                </HStack>
              </>
            )}
          </Heading>
        </Box>
      )}
    </>
  );
}
