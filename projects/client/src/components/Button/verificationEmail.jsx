import React from 'react';
import { Box, Center, Image, Text } from '@chakra-ui/react';
import '../App.css'
import IconMessage from '../assets/img/icon/Message.svg';

export default function VerificationEmail() {
    return (
        <>
            <Box w={['full', 'sm']} p={[8, 10]} mt={['200']} mx='auto' border={['none', '1px']} borderColor={['', 'gray.500']} borderRadius={10} rounded='3xl' >
                <Center><Image src={IconMessage} mt='-5' /></Center>
                <Text fontWeight='600' className='font-ibmFontRegular' textAlign='center' mt='3'>A verification link has been sent to your email</Text>
            </Box>

        </>

    )
}   