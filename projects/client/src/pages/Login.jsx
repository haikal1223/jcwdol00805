import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Box, VStack, Heading, Text, FormControl, FormLabel, Input, HStack, Checkbox, Button, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import '../App.css'
export default function Login() {


    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)


    const email = useRef()
    const password = useRef()

    let login = async () => {
        try {
            let email = email.current.value
            let password = password.current.value

            let response = await axios.get(`http://localhost:8000/user/login?email=${email}&password=${password}`)
            toast(response.data.message)
            localStorage.setItem('myToken', response.data.data.token)
        } catch (error) {
            toast(error.response.data.message)
        }
    }

    return (<Box w={['full', 'sm']} p={[8, 10]} mt={[20, '15vh']} mx='auto' border={['none', '1px']} borderColor={['', 'gray.500']} borderRadius={10}>
        <VStack spacing={4} align='flex-start' w='full'>
            <VStack spacing={1} align={['flex-start', 'left']} w='full'>
                <Heading>
                    <Text className='font-ibmFont'>Login</Text>
                </Heading>
            </VStack>
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
                <Checkbox><Text className='font-ibmFont'>Remember me.</Text></Checkbox>
                <Button variant='link' colorScheme='blue'><Text className='font-ibmFont'>Forgot Password?</Text></Button>
            </HStack>
            <Button rounded='lg' w={['30vh']} alignSelf='center' backgroundColor='#5D5FEF' color='white' className='font-ibmFont' onClick={login} >Login</Button>
            <Text fontSize='xs' alignSelf='center'>Don't have an account? <Button variant='link' colorScheme='blue' >Sign Up</Button></Text>
        </VStack>
    </Box>

    )
}