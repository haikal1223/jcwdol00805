import { Flex, 
    Menu,
    MenuButton, 
    Link,
    Icon,
    Text
} from "@chakra-ui/react";


export default function SideItem({icon, title, active, path}) {
    return (
        <Flex
            flexDir="column"
            w="100%"
            h="60px"
            alignItems={"flex-start"}>
            <Menu placement="right">
                <Link
                    background={active==="active" && "#A5A6F6"}
                    w="100%"
                    h="100%"
                    href={path}
                    _hover={active==="active"?{textDecor:'none', background:'#5D5FEF'}:{textDecor:'none', background:'#f0f0f0'}}
                >
                    <MenuButton>
                        <Flex
                            px={"15px"}
                            flexDir="row"
                            w="100%"
                            h="60px"
                            alignItems={"center"}
                            gap={"10px"}
                        >
                            <Icon as={icon} boxSize={'25px'} color={active==="active"? "white":'#5D5FEF'}/>
                            <Text className="font-ibmMed text-lg" color={active==="active"? "white":'#323643'}>{title}</Text>
                        </Flex>
                    </MenuButton>
                </Link>
            </Menu>

        </Flex>
    )
}