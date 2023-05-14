import { Box, Card, FormControl, FormLabel, Heading, Input, Text, VStack, Button, CardBody, Image } from "@chakra-ui/react";
import HeaderPattern from '../assets/img/homepage/HeaderPattern.svg';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpin from "react-loading-spin";

export default function RegisterUser() {

  const [disable, setdisable] = useState(false);
  const [message, setmessage] = useState();

  const email = useRef();
  const Navigate = useNavigate();

  let onForgotPass = async () => {
    try {
      setdisable(true);

      let { data } = await axios.post(
        "http://localhost:8000/user/forgot-password",
        { email: email.current.value }
      );
      toast.success(data.message);
      email.current.value = "";
      setTimeout(() => {
        Navigate("/");
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setdisable(false);
    }
  };
  let validateEmail = (value) => {
    if (value === "") {
      setmessage("Please input your email");
    } else if (
      !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value)
    ) {
      setmessage("Format Email Invalid");
    } else {
      setmessage("");
    }
  };

  return (
    <>
      <Box justifyContent={"center"} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={6} >
        <Image src={HeaderPattern}></Image>
        <VStack as='header' spacing='6' mt='91'>
          <Heading as='h1' fontWeight='600' fontSize='36px' letterSpacing='0,5px'>
            Forgot Password
          </Heading>
        </VStack>
        <Card maxWidth='300px'>
          <CardBody>
            <FormControl>
              <FormLabel size='sm'>
                E-Mail
              </FormLabel>
              <Input type='email' bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="user@gmail.com" required ref={email} onChange={(e) => validateEmail(e.target.value)} />
              <div className=" text-red-700 text-sm font-semibold font-ibmFont">
              </div>
            </FormControl>
            <Button rounded='3xl' w="248px" h="40px" alignSelf='center' backgroundColor='#5D5FEF' color='white' mt='5' type='button' disabled={disable} onClick={() => onForgotPass()} >
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



    </>
  )
}