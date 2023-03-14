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
  Editable,
  EditablePreview,
  EditableInput,
  EditableTextarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import "../App.css";

export default function Activation() {
  const [message, setMessage] = useState(
    "Password should be of minimum 8 character length and must contain lowercase, uppercase, number, and special character."
  );
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  let inputImage = useRef();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(0);
  const [password, setPassword] = useState("");
  const [uidUser, setUidUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState([]);
  const handleClickChangePassword = () =>
    setIsChangePassword(!isChangePassword);

  const navigate = useNavigate();
  let uid = "445ae5f1-a0d8-4c5e-8a7e-9a4e5163af0a";
  const toast = useToast();

  let getImage = () => {
    axios
      .get(`http://localhost:8000/user/getphoto?uid=${uid}`)
      .then((res) => {
        let profilePictureSplit = res.data.data[0].profile_photo.split(/\\/g)[2];
        setProfilePicture(`http://localhost:8000/images/${profilePictureSplit}`);
        console.log(profilePicture)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getImage();
  }, []);

  let handleImage = (e) => {
    console.log(e);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  let handleUploadImage = async (uid) => {
    try {
      if (file) {
        let formData = new FormData();
        formData.append("file", file);
        await axios.patch(`http://localhost:8000/user/uploadphoto/${uid}`, {
          formData,
        });

        toast({
          title: "Register Success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
        <VStack mx={[4]}>
          <VStack align={["flex-start", "left"]} w="full">
            <Heading>
              <Text mt="30px" className="font-ibmFont">
                User Profile
              </Text>
            </Heading>
          </VStack>
          <VStack align={["flex-start", "left"]} w="full">
            <Text
              fontSize={18}
              fontWeight={700}
              mt="30px"
              className="font-ibmFont"
            >
              Profile Picture
            </Text>
          </VStack>
          <HStack>
            <VStack w="150px">
              <FormControl mt="10px" mb="10px">
                <Image
                  boxSize="100px"
                  objectFit="cover"
                  src={`${profilePicture}`}
                  alt={`${profilePicture}`}
                  rounded="full"
                  id="imgpreview"
                />
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl mt="10px" mb="10px">
                <Input
                  rounded="lg"
                  variant="filled"
                  placeholder="File"
                  type="file"
                  p={["2pt"]}
                  onChange={(e) => handleImage(e)}
                  id="img"
                  ref={inputImage}
                />
                <Button
                  mt={["10pt"]}
                  rounded="lg"
                  w={["full"]}
                  alignSelf="center"
                  backgroundColor="#5D5FEF"
                  color="white"
                  className="font-ibmFont"
                  onClick={(e) =>
                    handleUploadImage("445ae5f1-a0d8-4c5e-8a7e-9a4e5163af0a")
                  }
                >
                  Change Photo
                </Button>
              </FormControl>
            </VStack>
          </HStack>
          <VStack align={["flex-start", "left"]} w="full">
            <Text
              fontSize={18}
              fontWeight={700}
              mt="30px"
              className="font-ibmFont"
            >
              Profile
            </Text>
          </VStack>
          <HStack w="full">
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">First Name</Text>
                </FormLabel>
                <Input rounded="lg" variant="filled" placeholder="First Name" />
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Last Name</Text>
                </FormLabel>
                <Input rounded="lg" variant="filled" placeholder="Last Name" />
              </FormControl>
            </VStack>
          </HStack>
          <HStack w="full">
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Email</Text>
                </FormLabel>
                <Input
                  rounded="lg"
                  variant="filled"
                  placeholder="Email"
                  isDisabled="true"
                />
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Gender</Text>
                </FormLabel>
                <Select
                  rounded="lg"
                  variant="filled"
                  placeholder="Select gender"
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </Select>
              </FormControl>
            </VStack>
          </HStack>
          <HStack w="full">
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Birth Place</Text>
                </FormLabel>
                <Input
                  rounded="lg"
                  variant="filled"
                  placeholder="Birth Place"
                />
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Birth Date</Text>
                </FormLabel>
                <Input
                  rounded="lg"
                  variant="filled"
                  placeholder="Birth Date"
                  type="date"
                />
              </FormControl>
            </VStack>
          </HStack>
          <VStack align={["flex-start", "left"]} w="full">
            <Text
              fontSize={18}
              fontWeight={700}
              mt="30px"
              className="font-ibmFont"
            >
              Password
            </Text>
          </VStack>
          {isChangePassword ? (
            <>
              <HStack w="full">
                <FormControl>
                  <FormLabel>
                    <Text className="font-ibmFont">Old Password</Text>
                  </FormLabel>
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Old Password"
                    type="password"
                  />
                </FormControl>
              </HStack>
              <HStack w="full">
                <FormControl>
                  <FormLabel>
                    <Text className="font-ibmFont">New Password</Text>
                  </FormLabel>
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Old Password"
                    type="password"
                  />
                </FormControl>
              </HStack>
              <HStack w="full">
                <FormControl>
                  <FormLabel>
                    <Text className="font-ibmFont">Confirm Password</Text>
                  </FormLabel>
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Old Password"
                    type="password"
                  />
                </FormControl>
              </HStack>
            </>
          ) : (
            <></>
          )}
          <Button
            rounded="lg"
            w={["full"]}
            alignSelf="center"
            backgroundColor="#5D5FEF"
            color="white"
            className="font-ibmFont"
            onClick={handleClickChangePassword}
          >
            {isLoading ? (
              <Spinner />
            ) : isChangePassword ? (
              "Save Password"
            ) : (
              "Change Password"
            )}
          </Button>
          <Button
            rounded="lg"
            w={["full"]}
            alignSelf="center"
            backgroundColor="#5D5FEF"
            color="white"
            className="font-ibmFont"
          >
            {isLoading ? <Spinner /> : "Save"}
          </Button>
          <VStack align={["flex-start", "left"]} w="full">
            <Text
              mb={["50pt"]}
              fontSize={18}
              fontWeight={700}
              mt="30px"
              className="font-ibmFont"
            >
              Address
            </Text>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
