import { 
    Image
    , Link 
    , HStack,
    textDecoration
} from "@chakra-ui/react"
import logo from '../supports/image/logo.svg'
import { TbReceipt, TbShoppingBag } from 'react-icons/tb';
import { IconContext } from "react-icons";

export default function Navbar () {
    
    return (
        <div className="flex justify-center sticky top-0 z-20">
            <div className="w-[100%] h-[86px] bg-white flex justify-between p-[24px] sticky top-0 shadow-[0_1px_10px_rgba(0,0,0,0.1)] z-20">
                <div>
                    <HStack>
                        <Link href='/'>
                            <div>
                                <Image src={logo}/>
                            </div>
                        </Link>
                        <Link _hover={{textDecoration:'none'}}>
                            <div className="font-ibmBold text-[20px] text-purple ml-3">
                                Login
                            </div>
                        </Link>
                    </HStack>
                </div>
                <div>
                <IconContext.Provider value={{ size:'2em', color: "#5D5FEF", className: "global-class-name" }}>
                    <HStack>
                        <Link>
                            <div>
                                <TbReceipt />
                            </div>
                        </Link>
                        <Link>
                            <div>
                                <TbShoppingBag />
                            </div>
                        </Link>
                    </HStack>
                </IconContext.Provider>
                </div>
            </div>
        </div>
    )
} 