import Login from "./login"
import {
    Image
    , Link
    , HStack
    , Button
    , Modal
    , useDisclosure
    , ModalOverlay
    , ModalContent

} from "@chakra-ui/react"
import logo from '../supports/image/logo.svg'
import { TbReceipt, TbShoppingBag } from 'react-icons/tb';
import { IconContext } from "react-icons";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {
    const navigate = useNavigate()

    const notLoggedIn = () => {
        if (!props.login) {
            toast.error('Please log in first.', {
                duration: 3000,
            })
        }
    }

    // replace '/' with null if do not want to redirect to home but stays
    const handleCartClick = async () => {
        await notLoggedIn();
        navigate(props.login ? '/cart' : '/')
    }

    const handleOrderClick = async () => {
        await notLoggedIn();
        navigate(props.login ? '/order' : '/')
    }
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div className="flex justify-center sticky top-0 z-20">
            <div className="w-[100%] h-[86px] bg-white flex justify-between p-[24px] sticky top-0 shadow-[0_1px_10px_rgba(0,0,0,0.1)] z-20">
                <div>
                    <HStack>
                        <Link href='/'>
                            <div>
                                <Image src={logo} />
                            </div>
                        </Link>
                        <Link _hover={{ textDecoration: 'none' }} onClick={onOpen}>
                            <div className="font-ibmBold text-[20px] text-purple ml-3">
                                Login
                            </div>
                        </Link>

                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <Login />
                            </ModalContent>
                            <Toaster />
                        </Modal >
                    </HStack>
                </div>
                <div>
                    <IconContext.Provider value={{ size: '2em', color: "#5D5FEF", className: "global-class-name" }}>
                        <HStack>
                            <Link href="#" onClick={handleOrderClick}>
                                <div>
                                    <TbReceipt />
                                </div>
                            </Link>
                            <Link href="#" onClick={handleCartClick}>
                                <div>
                                    <TbShoppingBag />
                                </div>
                            </Link>
                        </HStack>
                    </IconContext.Provider>
                </div>
            </div>
            <Toaster />
        </div >
    )
} 