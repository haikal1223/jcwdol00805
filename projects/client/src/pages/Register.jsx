import { Box, Card, FormControl, FormLabel, Heading, Input, Text, VStack, Button, CardBody, Image } from "@chakra-ui/react";
import HeaderPattern from '../assets/img/homepage/HeaderPattern.svg';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function RegisterUser() {
    const [errFirstName, seterrFirstName] = useState();
    const [errLastName, seterrLastName] = useState();
    const [errEmail, seterrEmail] = useState();
    const [disable, setdisable] = useState(false);

    const inputFirstName = useRef();
    const inputLastName = useRef();
    const inputEmail = useRef();

    const location = useLocation();

    const Navigate = useNavigate()

    let onRegister = async () => {
        try {
            setdisable(true);
            let { data } = await axios.post("http://localhost:8000/user/register", {
                first_name: inputFirstName.current.value,
                last_name: inputLastName.current.value,
                email: inputEmail.current.value

            });
            toast.success(data.message);
            inputFirstName.current.value = ""
            inputLastName.current.value = ""
            inputEmail.current.value = ""
            setTimeout(() => {
                Navigate('/');
            }, 2000)

        } catch (error) {
            toast.error(error.data.message);
        } finally {
            setdisable(false);
        }
    };

    let validateFirstName = (val) => {
        if (val === "") {
            seterrFirstName("Input your first name");
        } else if (val.length <= 2) {
            seterrFirstName("Name to short, less than 2 characters");
        } else if (val.length > 25) {
            seterrFirstName("Name to long, maximum 20 characters");
        } else {
            seterrFirstName('')
        }

    }

    let validateLastName = (val) => {
        if (val === "") {
            seterrLastName("Input your first name");
        } else if (val.length <= 2) {
            seterrLastName("Name to short, less than 2 characters");
        } else if (val.length > 25) {
            seterrLastName("Name to long, maximum 20 characters");
        } else {
            seterrLastName('')
        }

    }

    let validateEmail = (val) => {
        if (val === "") {
            seterrEmail("Input your email address")
        } else if (
            !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(val)
        ) {
            seterrEmail("Invalid Format, Please input again")
        } else {
            seterrEmail('');
        }
    }


    return (
        <>
            <Box justifyContent={"center"} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={6} >
                <Image src={HeaderPattern}></Image>
                <VStack as='header' spacing='6' mt='91'>
                    <Heading as='h1' fontWeight='600' fontSize='36px' letterSpacing='0,5px'>
                        What's Your Name?
                    </Heading>
                </VStack>
                <Card maxWidth='300px'>
                    <CardBody>
                        <FormControl>
                            <FormLabel size='sm'>
                                First Name
                            </FormLabel>
                            <Input type='text' bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="First Name" required ref={inputFirstName} onChange={(e) => validateFirstName(e.target.value)} />
                            <div className=" text-red-700 text-sm font-semibold font-ibmFont">
                                {errFirstName ? errFirstName : null}
                            </div>
                        </FormControl>
                        <FormControl>
                            <FormLabel size='sm'>
                                Last Name
                            </FormLabel>
                            <Input type='text' bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="Last Name" required ref={inputLastName} onChange={(e) => validateLastName(e.target.value)} />
                            <div className=" text-red-700 text-sm font-semibold font-ibmFont">
                                {errLastName ? errLastName : null}
                            </div>
                        </FormControl>
                        <FormControl>
                            <FormLabel size='sm'>
                                Email
                            </FormLabel>
                            <Input type='email' bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="username@gmail.com" required ref={inputEmail} onChange={(e) => validateEmail(e.target.value)} />
                        </FormControl>
                        <Button rounded='3xl' w="248px" h="40px" alignSelf='center' backgroundColor='#5D5FEF' color='white' mt='5' type='button' disabled={disable} onClick={() => onRegister()} >
                            <Text className=" font-ibmFontRegular">
                                VERIFY EMAIL
                            </Text>
                        </Button>
                        <Toaster />
                    </CardBody>
                </Card>
            </Box>



        </>
    )
}
