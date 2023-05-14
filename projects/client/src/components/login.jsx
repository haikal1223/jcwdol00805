import { useState, useRef, } from 'react';
import { Toaster, toast, } from 'react-hot-toast';
import axios from 'axios';
import { Tag, Link, Box, VStack, Heading, ModalCloseButton, Text, FormControl, FormLabel, Input, HStack, Checkbox, Button, Icon, InputGroup, InputRightElement, useDisclosure } from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import '../App.css'


export default function Login() {


    const [profile, setProfile] = useState([])
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)


    const email = useRef()
    const password = useRef()
    let login = async () => {
        try {
            let inputEmail = email.current.value

            let inputPassword = password.current.value


            let response = await axios.get(`http://localhost:8000/user/login?email=${inputEmail}&password=${inputPassword}`)
            toast(response?.data?.message)
            setProfile(response?.data?.data)
            localStorage.setItem('myToken', response.data.data.token)
            window.location.reload()
        } catch (error) {
            toast(error?.response?.data?.message)
            console.log(error)
        }
    }

    return (
        <Tag>

            < Box w={['full', 'md']} p={[8, 20]} mt={[20, '1vh']} mx='auto'>
                <VStack spacing={4} align='flex-start' w='full'>
                    <HStack spacing={1} align={['flex-start', 'left']} w='full'>
                        <Heading>
                            <Text className='font-ibmFont'>
                                Login
                            </Text>
                        </Heading>
                        <ModalCloseButton />
                    </HStack>
                    <FormControl>
                        <FormLabel><Text className='font-ibmFont'>E-mail</Text></FormLabel>
                        <Input ref={email} rounded='lg' variant='filled' placeholder='Your Email' />
                    </FormControl>
                    <FormControl>
                        <FormLabel><Text className='font-ibmFont'>Password</Text></FormLabel>
                        <InputGroup>
                            <Input ref={password} rounded='lg' variant='filled' type={show ? 'text' : 'password'} placeholder='Password' />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <HStack w='full' justify='space-between'>
                        <Checkbox><Text className='font-ibmFont' fontSize='12px'>Remember me.</Text></Checkbox>
                        <Link href="/forgotpassword"><Button variant='link' colorScheme='blue'><Text className='font-ibmFont' fontSize='12px'>Forgot Password?</Text></Button></Link>
                    </HStack>
                    <Button rounded='lg' w={['30vh']} alignSelf='center' backgroundColor='#5D5FEF' color='white' className='font-ibmFont' onClick={login} >Login</Button>
                    <Text fontSize='xs' alignSelf='center'>Don't have an account? <Link variant='link' colorScheme='blue' href="/register" >Sign Up</Link></Text>
                </VStack>
            </Box >

            <Toaster />

        </Tag>
    )
}