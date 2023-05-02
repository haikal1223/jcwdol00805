import { 
    Box
    , Button
    , HStack
    , IconButton
    , Image
    , Text
    , Table
    , Thead
    , Tbody
    , Tr
    , Td
    , TableContainer
    , VStack
    , Input
  } from "@chakra-ui/react";

const ProductDetail = (props) => {
return (
    <>
        <Text className="font-ibmMed text-lg">Product Detail</Text>
        <hr className="w-[100%] my-4 border-[2px]"/>
        <HStack spacing={10} align={'start'}>
            <Image boxSize={'100px'} objectFit={'cover'} src={props.data.image_url}/>
            <VStack w={"full"} h={'full'} justifyContent={'flex-start'}>
            <HStack w="full" justify={"start"} alignItems={'center'}>
                <Text className="text-grey font-ibmReg w-[250px]">name</Text>
                <Text className="font-ibmMed">{props.data.name}</Text>
            </HStack>
            <HStack w="full" justify={"start"} alignItems={'center'}>
                <Text className="text-grey font-ibmReg w-[250px]">category</Text>
                <Text className="font-ibmMed">{props.data.category_name}</Text>
            </HStack>
            <HStack w="full" justify={"start"} alignItems={'center'}>
                <Text className="text-grey font-ibmReg w-[250px]">created at</Text>
                <Text className="font-ibmMed">
                    {new Date(props.data.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZoneName: "short",
                    })}
                </Text>
            </HStack>
            </VStack>
        </HStack>
        <br />
    </>
)
}

export default ProductDetail
  