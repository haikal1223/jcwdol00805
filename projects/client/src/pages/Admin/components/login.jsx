import { useState, useRef, } from 'react';
import { Toaster, toast, } from 'react-hot-toast';
import axios from 'axios';
import { Tag, Link, Box, VStack, Heading, ModalCloseButton, Text, FormControl, FormLabel, Input, HStack, Checkbox, Button, Icon, InputGroup, InputRightElement, useDisclosure } from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


export default function AdminLogin() {


    const [profile, setProfile] = useState([])
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
            setProfile(response?.data?.data)
            localStorage.setItem('adminToken', response.data.data.token)
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
                        <FormLabel><Text className='font-ibmReg'>E-mail</Text></FormLabel>
                        <Input ref={email} rounded='lg' variant='filled' placeholder='Your Email' />
                    </FormControl>
                    <FormControl>
                        <FormLabel><Text className='font-ibmReg'>Password</Text></FormLabel>
                        <InputGroup>
                            <Input ref={password} rounded='lg' variant='filled' type={show ? 'text' : 'password'} placeholder='Password' />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    
                    <Button rounded='lg' w={['30vh']} alignSelf='center' backgroundColor='#5D5FEF' color='white' className='font-ibmReg' onClick={login} >Login</Button>
                    
                </VStack>
            </Box >

            <Toaster />

        </Tag>
    )
}