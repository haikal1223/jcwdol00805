import { Box, Card, FormControl, FormLabel, Heading, Input, Text, VStack, Button, CardBody, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpin from "react-loading-spin";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import HeaderPattern from '../assets/img/homepage/HeaderPattern.svg';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function UpdatePassword() {

  const [showPassword, setshowPassword] = useState(false);
  const [showconfPass, setshowconfPass] = useState(false);
  const [message, setmessage] = useState();
  const [disable, setdisable] = useState(false);
  const [msg, setmsg] = useState();

  const Navigate = useNavigate();

  const pass = useRef()
  const confPass = useRef()

  const location = useLocation();

  let onSubmit = async () => {

    try {
      setdisable(true);

      let { data } = await axios.patch(
        "http://localhost:8000/user/reset-password/uid",
        { uid: location.pathname.slice(16), password: pass.current.value, confPassword: confPass.current.value }
      );


      toast.success(data.message);
      pass.current.value = ''
      confPass.current.value = ''

      setTimeout(() => {
        Navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setdisable(false);
    }
  };
  let onValidatePassword = (value) => {
    if (value === "") {
      setmessage("Please input your new password");
    } else if (value.length < 8) {
      setmessage("Password less than 8 character, please input more");
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(
        value
      )
    ) {
      setmessage("Password must contain number and capital");
    } else {
      setmessage("");
    }
  };
  let onValidateConfPassword = (value) => {
    if (value === "") {
      setmsg("Please input your confirm password");
    } else if (value.length < 8) {
      setmsg("Password less than 8 character, please input more");
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(
        value
      )
    ) {
      setmsg("Password must contain number and capital");
    } else {
      setmsg("");
    }
  };

  return (
    <Box justifyContent={"center"} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={6} >
      <Image src={HeaderPattern}></Image>
      <VStack as='header' spacing='6' mt='91'>
        <Heading as='h1' fontWeight='600' fontSize='36px' letterSpacing='0,5px'>
          Update Password
        </Heading>
      </VStack>
      <Card maxWidth='300px'>
        <CardBody>
          <FormControl>
            <FormLabel size='sm'>
              New Password
            </FormLabel>
            <Input type={showPassword ? 'text' : 'password'} bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="Enter your new Password" required ref={pass} onChange={(e) => onValidatePassword(e.target.value)} />
            <div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
              {message ? message : null}
            </div>
            <div className=" text-2xl absolute right-5 top-9">
              {showPassword ? (
                <AiFillEye
                  onClick={() =>
                    setshowPassword((showPassword) => !showPassword)
                  }
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={() =>
                    setshowPassword((showPassword) => !showPassword)
                  }
                />
              )}
            </div>
          </FormControl>
          <FormControl>
            <FormLabel size='sm'>
              Confirm Password
            </FormLabel>
            <Input type={showconfPass ? 'text' : 'password'} bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="Confirm your password" required ref={confPass} onChange={(e) => onValidateConfPassword(e.target.value)} />
            <div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
              {msg ? msg : null}
            </div>
            <div className=" text-2xl absolute right-5 top-9">
              {showPassword ? (
                <AiFillEye
                  onClick={() =>
                    setshowconfPass((showconfPass) => !showconfPass)
                  }
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={() =>
                    setshowconfPass((showconfPass) => !showconfPass)
                  }
                />
              )}
            </div>
          </FormControl>
          <Button rounded='3xl' w="248px" h="40px" alignSelf='center' backgroundColor='#5D5FEF' color='white' mt='5' type='submit' disabled={disable} onClick={() => onSubmit()} >
            {disable ? (
              <LoadingSpin
                size={"20px"}
                primaryColor={"red"}
                secondaryColor={"grey"}
              />
            ) : (
              "Submit"
            )}
            <Text className=" font-ibmFontRegular">
            </Text>
          </Button>
          <Toaster />
        </CardBody>
      </Card>
    </Box>
  )
}

export default UpdatePassword;
