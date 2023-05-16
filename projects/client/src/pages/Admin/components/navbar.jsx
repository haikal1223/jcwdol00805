import AdminLogin from "./login.jsx"
import {
    Image
    , Link
    , Modal
    , useDisclosure
    , ModalOverlay
    , ModalContent

} from "@chakra-ui/react"
import logo from '../../../supports/image/logo.svg'
import { toast, Toaster } from "react-hot-toast";

export default function AdminNavbar(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div className="flex justify-center sticky top-0 z-50">
            <div className="w-[100%] h-[86px] bg-white flex justify-between p-[24px] sticky top-0 shadow-[0_1px_10px_rgba(0,0,0,0.1)] z-50">
                <div>
                    <Link href='/admin'>
                        <div>
                            <Image src={logo} />
                        </div>
                    </Link>
                </div>
                {
                    props.login && props.role === 'admin'?
                            <div className="font-ibmBold text-[20px] ml-3 text-purple">
                                ⭐ Admin ⭐
                            </div>
                    : props.login && props.role === 'wh_admin'?
                            <div className="font-ibmBold text-[20px] ml-3 text-purple">
                                Warehouse Admin
                            </div>
                    :
                    <></>
                }
                <div>
                    {props.login?
                    <Link color='#FF3838' _hover={{ textDecoration: 'none', color:'#5D5FEF' }} onClick={props.func}>
                        <div className="font-ibmBold text-[20px] ml-3">
                            Logout
                        </div>
                    </Link>
                    :
                    <>
                        <Link color='#5D5FEF' _hover={{ textDecoration: 'none', color:'#A5A6F6' }} onClick={onOpen}>
                            <div className="font-ibmBold text-[20px] ml-3">
                                Login
                            </div>
                        </Link>

                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <AdminLogin />
                            </ModalContent>
                        </Modal >
                    </>
                    }
                </div>
            </div>
            <Toaster />
        </div >
    )
} 