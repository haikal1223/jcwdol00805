import { useState, useRef, useEffect } from "react";
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

export default function EditProfile() {
  const [message, setMessage] = useState("");
  const [matchMessage, setMatchMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  let inputImage = useRef();
  const [profilePicture, setProfilePicture] = useState([]);
  const handleClickChangePassword = () =>
    setIsChangePassword(!isChangePassword);
  const [editMode, setEditMode] = useState(false);
  const [uid,setUid] = useState('994de40d-249e-45a2-bee8-531dabf884d1')

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [genderValue, setGenderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState(
    new Date(0).toISOString().slice(0, 10)
  );
  const [birthPlace, setBirthPlace] = useState("-");
  const [file, setFile] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toast = useToast();
  let getUid = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
        setUid('e867cba8-dcd7-4fd2-8dcf-34316567b8c7')
    } catch (error) {}
  };
  let validatePassword = (val) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{4,}$/;
    if (!regex.test(val)) {
      if (val.length < 8) {
        setMessage(
          "New password should be of minimum 8 character length and must contain lowercase, uppercase, number, and special character."
        );
      } else {
        setMessage(
          "New password must contain lowercase, uppercase, number, and special character."
        );
      }
    } else {
      if (val.length < 8) {
        setMessage("New password should be of minimum 8 character length.");
      } else {
        setMessage("");
      }
    }
  };

  let validateMatchNewPassword = (val1, val2) => {
    if (!val1 || !val2) {
      setMatchMessage("");
    } else {
      if (val1 !== val2) {
        setMatchMessage("These passwords do not match.");
      } else {
        setMatchMessage("");
      }
    }
  };

  const handleEditProfile = () => {
    if (editMode) {
      setEditMode(!editMode);
      axios.patch(`http://localhost:8000/user/updateprofile/${uid}`, {
        first_name: firstName,
        last_name: lastName,
        gender: genderValue,
        birth_date: birthDate,
        birth_place: birthPlace,
      });
    } else {
      setEditMode(!editMode);
    }
  };

  let getImage = () => {
    axios
      .get(`http://localhost:8000/user/getphoto?uid=${uid}`)
      .then((res) => {
        let profilePictureSplit =
          res.data.data[0].profile_photo.split(/\\/g)[2];
        setProfilePicture(
          `http://localhost:8000/images/${profilePictureSplit}`
        );
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let getData = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8000/user/verification?uid=${uid}`
      );
      setFirstName(response.data.data[0].first_name);
      setLastName(response.data.data[0].last_name);
      setEmail(response.data.data[0].email);
      if (response.data.data[0].gender) {
        setGenderValue(response.data.data[0].gender);
      }
      if (response.data.data[0].birth_date) {
        setBirthDate(response.data.data[0].birth_date);
      }
      if (response.data.data[0].birth_place) {
        setBirthPlace(response.data.data[0].birth_place);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getImage();
    getData();
    getUid();
  }, []);

  let handleImage = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  let handleUploadImage = async () => {
    try {
      if (file) {
        let formData = new FormData();
        formData.append("images", file);
        await axios.patch(
          `http://localhost:8000/user/uploadphoto?uid=${uid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
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
      toast({
        title: "Error in upload photo",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  let changePassword = async (uid) => {
    try {
      let inputOldPassword = oldPassword;
      let inputNewPassword = newPassword;
      let inputConfirmPassword = confirmPassword;

      let response = await axios.patch(
        `http://localhost:8000/user/updatepassword?uid=${uid}`,
        {
          inputOldPassword,
          inputNewPassword,
          inputConfirmPassword,
          message,
          matchMessage,
        }
      );

      toast({
        title: "Change Password Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setIsChangePassword(isChangePassword);
      setMessage("");
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
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
                  alt={"Profile Picture"}
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
                  onClick={(e) => handleUploadImage()}
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
                {editMode ? (
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                ) : (
                  <>
                    <Text my={3}>{firstName}</Text>
                  </>
                )}
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Last Name</Text>
                </FormLabel>
                {editMode ? (
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                ) : (
                  <>
                    <Text my={3}>{lastName}</Text>
                  </>
                )}
              </FormControl>
            </VStack>
          </HStack>
          <HStack w="full">
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Email</Text>
                </FormLabel>
                {editMode ? (
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Email"
                    isDisabled="true"
                    value={email}
                  />
                ) : (
                  <>
                    <Text my={3}>{email}</Text>
                  </>
                )}
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Gender</Text>
                </FormLabel>
                {editMode ? (
                  <Select
                    rounded="lg"
                    variant="filled"
                    onChange={(event) => {
                      setGenderValue(event.target.value);
                      console.log(genderValue);
                    }}
                    placeholder="Choose gender"
                  >
                    {genderValue == 1 ? (
                      <>
                        <option value={1} selected>
                          Male
                        </option>
                        <option value={2}>Female</option>
                      </>
                    ) : genderValue == 2 ? (
                      <>
                        <option value={1}>Male</option>
                        <option value={2} selected>
                          Female
                        </option>
                      </>
                    ) : (
                      <>
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                      </>
                    )}
                  </Select>
                ) : (
                  <>
                    <Text my={3}>
                      {genderValue == 1
                        ? "Male"
                        : genderValue == 2
                        ? "Female"
                        : "-"}
                    </Text>
                  </>
                )}
              </FormControl>
            </VStack>
          </HStack>
          <HStack w="full">
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Birth Place</Text>
                </FormLabel>
                {editMode ? (
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Birth Place"
                    value={birthPlace}
                    onChange={(event) => setBirthPlace(event.target.value)}
                  />
                ) : (
                  <>
                    <Text my={3}>{birthPlace}</Text>
                  </>
                )}
              </FormControl>
            </VStack>
            <VStack w="full">
              <FormControl>
                <FormLabel>
                  <Text className="font-ibmFont">Birth Date</Text>
                </FormLabel>
                {editMode ? (
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Birth Date"
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                  />
                ) : (
                  <>
                    <Text my={3}>{birthDate}</Text>
                  </>
                )}
              </FormControl>
            </VStack>
          </HStack>
          <Button
            rounded="lg"
            w={["full"]}
            alignSelf="center"
            backgroundColor="#5D5FEF"
            color="white"
            className="font-ibmFont"
            onClick={handleEditProfile}
          >
            {isLoading ? <Spinner /> : editMode ? "Save" : "Edit Profile"}
          </Button>
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
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                      validateMatchNewPassword(e.target.value, confirmPassword);
                    }}
                  />
                </FormControl>
              </HStack>
              <Text color="red">{message}</Text>
              <HStack w="full">
                <FormControl>
                  <FormLabel>
                    <Text className="font-ibmFont">Confirm Password</Text>
                  </FormLabel>
                  <Input
                    rounded="lg"
                    variant="filled"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateMatchNewPassword(e.target.value, newPassword);
                    }}
                  />
                </FormControl>
              </HStack>
              <VStack align={["flex-start", "left"]}>
                <Text color="red">{matchMessage}</Text>
              </VStack>
            </>
          ) : (
            <></>
          )}

          {isLoading ? (
            <Spinner />
          ) : isChangePassword ? (
            <Button
              rounded="lg"
              w={["full"]}
              alignSelf="center"
              backgroundColor="#5D5FEF"
              color="white"
              className="font-ibmFont"
              onClick={() => changePassword(uid)}
            >
              Save Password
            </Button>
          ) : (
            <Button
              rounded="lg"
              w={["full"]}
              alignSelf="center"
              backgroundColor="#5D5FEF"
              color="white"
              className="font-ibmFont"
              onClick={handleClickChangePassword}
            >
              Change Password
            </Button>
          )}
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
