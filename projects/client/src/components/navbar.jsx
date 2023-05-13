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
    , Menu
    , MenuButton
    , MenuItem
    , MenuList
    , Avatar
} from "@chakra-ui/react"
import logo from '../supports/image/logo.svg'
import { TbReceipt, TbShoppingBag } from 'react-icons/tb';
import { IconContext } from "react-icons";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar(props) {
    const navigate = useNavigate()
    const [id, setId] = useState("");
    const [profilePicture, setProfilePicture] = useState([]);

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

    let getId = async () => {
        try {
          let token = localStorage.getItem("myToken");
          let response = await axios.get(
            `http://localhost:8000/user/verifytoken?token=${token}`
          );
          setId(response?.data?.data?.id);
        } catch (error) {
          console.log(error.response.data);
        }
      };

    let getImage = () => {
        axios
          .get(`http://localhost:8000/user/getphoto?id=${id}`)
          .then((res) => {
            let profilePictureSplit =
              res.data.data[0].profile_photo.split(/\\/g)[2];
            setProfilePicture(
              `http://localhost:8000/images/${profilePictureSplit}`
            );
          })
          .catch((err) => {
            console.log(err);
          });
      };

      useEffect(() => {
        getId();
      }, []);
      useEffect(() => {
        getImage();
      }, [id]);

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
                        {props.login?
                            
                            <Menu>
                                <MenuButton>
                                    {/* <Avatar size='sm' bg='teal.500' ml={3}/> */}
                                    <Image
                                        boxSize="32px"
                                        objectFit="cover"
                                        src={`${profilePicture}`}
                                        alt={"Profile Picture"}
                                        rounded="full"
                                        ml={3}
                                        />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem as='a' href='/edit-profile'>
                                        <div className="font-ibmMed text-[18px]">
                                            Edit profile
                                        </div>
                                    </MenuItem>
                                    <MenuItem as='a' href='#' onClick={props.func}>
                                        <div className="font-ibmMed text-[18px] text-red">
                                            Logout
                                        </div>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                                
                                
                            
                            :
                            <>
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
                            </>
                        }
                        
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