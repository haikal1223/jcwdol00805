import { 
    Image
    , Link 
    , HStack
    , VStack
} from "@chakra-ui/react"
import logo from '../supports/image/logo.svg'
import { TbReceipt, TbShoppingBag } from 'react-icons/tb';
import { IconContext } from "react-icons";

export default function Footer() {
    return (
        <div className="flex justify-center">
            <VStack>
                <div className="w-[375px] h-[105px] bg-white flex items-center justify-between p-[24px] z-50">
                    <div>
                        <VStack>
                            <Link href='/'>
                                <div>
                                    <Image src={logo}/>
                                </div>
                            </Link>
                            <Link _hover={{textDecoration:'none'}}>
                                <div className="font-ibmBold text-[16px] text-purple">
                                    ikeanye
                                </div>
                            </Link>
                        </VStack>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="font-ibmMed font-[10px]">Follow us</div>
                        <Link _hover={{textDecoration:'none'}}>
                            <div className="font-ibmReg font-[10px] text-lgrey hover:text-purple">GitHub</div>
                        </Link>
                        <Link _hover={{textDecoration:'none'}}>
                            <div className="font-ibmReg font-[10px] text-lgrey hover:text-purple">Twitter</div>
                        </Link>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="font-ibmMed font-[10px]">Resources</div>
                        <Link _hover={{textDecoration:'none'}}>
                            <div className="font-ibmReg font-[10px] text-lgrey hover:text-purple">About Us</div>
                        </Link>
                        <Link _hover={{textDecoration:'none'}}>
                            <div className="font-ibmReg font-[10px] text-lgrey hover:text-purple">Terms & Condition</div>
                        </Link>
                    </div>
                </div>
                <div className="w-[375px] h-[20px] bg-purple font-ibmMed text-[12px] text-white flex items-center justify-center p-[24px] z-50">
                    © 2023 JWCDOL08
                </div>
            </VStack>
        </div>
    )
}