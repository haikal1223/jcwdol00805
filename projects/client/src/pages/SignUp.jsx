import { Box, Card, FormControl, FormLabel, Heading, Input, Text, VStack, Button, CardBody, Image } from "@chakra-ui/react";
import HeaderPattern from '../assets/img/homepage/HeaderPattern.svg'


export default function SignUp() {

    return (
        <>
            <Box justifyContent={"center"} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={6} >
                <Image src={HeaderPattern}></Image>
                <VStack as='header' spacing='6' mt='181'>
                    <Heading as='h1' fontWeight='600' fontSize='36px' letterSpacing='0,5px'>
                        Sign Up
                    </Heading>
                </VStack>
                <Card maxWidth='300px'>
                    <CardBody>
                        <FormControl>
                            <FormLabel size='sm'>
                                E-mail
                            </FormLabel>
                            <Input type='text' bg='white' borderColor='#d8dee4' size='sm' borderRadius='6px' placeholder="username@gmail.com" />
                        </FormControl>
                        <Button rounded='3xl' w="248px" h="40px" alignSelf='center' backgroundColor='#5D5FEF' color='white' mt='5' >
                            <Text className=" font-ibmFontRegular">
                                VERIFY EMAIL
                            </Text>
                        </Button>
                    </CardBody>
                </Card>
            </Box>

        </>
    )
}