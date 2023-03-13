import { Box, Flex, Button, Text } from "@chakra-ui/react";



export default function LoginBtn() {
    return (
        <>
            <Button rounded='3xl' w="248px" h="60px" alignSelf='center' backgroundColor='#5D5FEF' color='white' >
                <Text className=" font-ibmFontRegular">
                    RESEND LINK
                </Text>
            </Button>
        </>
    )

}