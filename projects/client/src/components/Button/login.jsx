import React from 'react';
import { Box, VStack, Heading, Text, FormControl, FormLabel, Input, HStack, Checkbox, Button, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import '../App.css'
import LoginBtn from './Buttons/loginbutton';

export default function Login() {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (<Box w={['full', 'sm']} p={[8, 10]} mt={[20, '15vh']} mx='auto' border={['none', '1px']} borderColor={['', 'gray.500']} borderRadius={10}>
        <VStack spacing={4} align='flex-start' w='full'>
            <VStack spacing={1} align={['flex-start', 'left']} w='full'>
                <Heading>
                    <Text className='font-ibmFont'>Login</Text>
                </Heading>
            <FormControl>
                <FormLabel><Text className='font-ibmFont'>E-mail</Text></FormLabel>
                <Input rounded='lg' variant='filled' placeholder='Your Email' />
            </FormControl>
            </VStack>
            <FormControl>
                <FormLabel><Text className='font-ibmFont'>Password</Text></FormLabel>
                <InputGroup>
                    <Input rounded='lg' variant='filled' type={show ? 'text' : 'password'} placeholder='Password' />
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
            <LoginBtn />
            <Text fontSize='xs' alignSelf='center'>Don't have an account? <Button variant='link' colorScheme='blue' >Sign Up</Button></Text>
        </VStack>
    </Box>

    )
}   