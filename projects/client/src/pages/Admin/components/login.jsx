import { useState, useRef, } from 'react';
import { Toaster, toast, } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Tag, Box, VStack, Heading, ModalCloseButton, Text, FormControl, FormLabel, Input, HStack, Button, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


export default function AdminLogin() {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const email = useRef()
    const password = useRef()
    let login = async () => {
        try {
            let inputEmail = email.current.value
            let inputPassword = password.current.value

            let response = await axios.get(`http://localhost:8000/admin/login?email=${inputEmail}&password=${inputPassword}`)
            
            toast.success(response?.data?.message, {duration: 3000})
            Cookies.set('adminToken', response.data.data.token, { expires: 1/24, path: '/' })
            window.location.reload()
        } catch (error) {
            toast.error(error?.response?.data.message)
        }
    }

    return (
        <Tag>

            < Box w={['full', 'md']} p={[8, 20]} mt={[20, '1vh']} mx='auto'>
                <VStack spacing={4} align='flex-start' w='full'>
                    <HStack spacing={1} align={['flex-start', 'left']} w='full'>
                        <Heading>
                            <Text className='font-ibmReg'>
                                Admin Login
                            </Text>
                        </Heading>
                        <ModalCloseButton />
                    </HStack>
                    <FormControl>
                        <FormLabel><Text className='font-ibmMed'>E-mail</Text></FormLabel>
                        <Input ref={email} rounded='lg' variant='filled' placeholder='Your Email' bg='#f5f5f5' border-1 borderColor={'#D9D9D9'} />
                    </FormControl>
                    <FormControl>
                        <FormLabel><Text className='font-ibmMed'>Password</Text></FormLabel>
                        <InputGroup>
                            <Input ref={password} rounded='lg' variant='filled' type={show ? 'text' : 'password'} placeholder='Password' bg='#f5f5f5' border-1 borderColor={'#D9D9D9'} />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    
                    <Button rounded='lg' w={['4.5rem']} alignSelf='center' backgroundColor='#5D5FEF' color='white' className='font-ibmReg' onClick={login} >Login</Button>
                    
                </VStack>
            </Box >

            <Toaster
                toastOptions={{
                style: {
                height: "50px",
                width: "175px",
                },
                }}
            />

        </Tag>
    )
}