import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import ProductDetail from "./components/productDetail";
import ModalStock from "./components/modalStock";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  useDisclosure,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {toast, Toaster} from 'react-hot-toast'

const AdminProductDetail = () => {
  const { product_id } = useParams();

  const [uid, setUid] = useState("");
  const [whAdmin, setWhAdmin] = useState("");
  const [productDetail, setProductDetail] = useState([]);
  const [stockDetail, setStockDetail] = useState([]);
  const [log, setLog] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editStock, setEditStock] = useState({});
  const [renderDelete, setRenderDelete] = useState(false)

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const rowPerPage = 5;

  const [whList, setWhList] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const getUid = async () => {
    try {
      let token = localStorage.getItem("adminToken");
      let response = await axios.get(
        `http://localhost:8000/admin/verify-token?token=${token}`
      );
      setUid(response.data.data.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchWarehouse = async () => {
    if (uid) {
      try {
        let response = await axios.get(
          `http://localhost:8000/admin/fetch-warehouse?id=${uid}`
        );
        setWhAdmin(response.data.data[0][0].wh_id);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const fetchProductDetail = async () => {
    const offset = (page - 1) * rowPerPage;
    try {
      let response = await axios.get(
        `http://localhost:8000/admin-product/fetch/${product_id}?row=${rowPerPage}&offset=${offset}`
      );
      setProductDetail(response.data.data.detail[0][0]);
      setStockDetail(response.data.data.stock[0]);
      setLog(response.data.data.log[0]);
      setEditStock(
        response.data.data.stock[0].reduce((obj, item) => {
          obj[item.id] = item.stock;
          return obj;
        }, {})
      );
      setMaxPage(
        Math.ceil(
          parseInt(response.data.data.countLog[0][0].num_log) / rowPerPage
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditStock = (id) => {
    setEditMode({ ...editMode, [id]: true });
  };

  const handleSaveStock = async (whId, oldVal) => {
    if (oldVal !== parseInt(editStock[whId])) {
      await axios.patch(
        `http://localhost:8000/admin-product/edit-stock/${product_id}`,
        {
          whid: whId,
          oldStock: oldVal,
          newStock: parseInt(editStock[whId]),
          uid: uid,
        }
      );
      setEditMode({ ...editMode, [whId]: false });
    } else {
      setEditMode({ ...editMode, [whId]: false });
    }
  };

  // to disable add button if stock for certain wh already exist
  const [isExist, setIsExist] = useState(false);
  const handleExistWh = () => {
    for (let i = 0; i < stockDetail.length; i++) {
      if (stockDetail[i].id === parseInt(whAdmin)) {
        setIsExist(true);
        break;
      }
      setIsExist(false);
    }
    return null;
  };

  const handleDeletestock = async(id, stock) => {
    try {
      await axios.delete(`http://localhost:8000/admin-product/delete-stock/${product_id}?wh=${id}&stock=${stock}&uid=${uid}`)
      toast.success('stock deleted')
      setRenderDelete(!renderDelete)
    } catch (error) {
      console.log(error.message)
    }
  }

  // Modal Add Stock
  const handleModalOpen = async () => {
    try {
        let response = await axios.get(`http://localhost:8000/admin-product/fetch-warehouse/${product_id}?whid=${whAdmin}`)
        setWhList(response.data.data[0])
    } catch (error) {
        console.log(error.message)
    }
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setWhList({})
    setIsModalOpen(false);
  };

  // pagination
  const nextPageHandler = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };
  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const firstPageHandler = () => {
    if (page > 1) {
      setPage(1);
    }
  };
  const maxPageHandler = () => {
    if (page < maxPage) {
      setPage(maxPage);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    getUid();
  }, [editMode, page, renderDelete, whList]);
  useEffect(() => {
    fetchWarehouse();
  }, [uid]);
  useEffect(() => {
    handleExistWh();
  }, [stockDetail, uid]);

  return (
    <div className="w-[100%] flex flex-1 justify-between">
      <Sidebar />
      <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
        <div className="w-[1140px] min-h-screen flex justify-center items-start overflow-auto ">
          {/*REPLACE BELOW FOR CONTENT*/}
          <Box className="bg-white w-full h-auto drop-shadow-md p-9">
            <Text className="font-ibmMed text-4xl">
              Product #{productDetail.id}
            </Text>
            <br />
            <VStack spacing={2} align="flex-start" w="full" className="pb-5">
              <ProductDetail data={productDetail} />

              <HStack w={"full"} justifyContent={"space-between"}>
                <Text className="font-ibmMed text-lg">Stock Breakdown</Text>
                <Button
                  isDisabled={whAdmin !== "all" && isExist}
                  color={"#5D5FEF"}
                  variant={"outline"}
                  onClick={() => handleModalOpen(whAdmin)}
                >
                  add stock
                </Button>
              </HStack>
              <hr className="w-[100%] my-4 border-[2px]" />
              <Box w={"full"} maxH={"300px"} overflow={"auto"}>
                <Table w={"full"} h={"100%"} variant="simple">
                  <Thead position="sticky" top={0} zIndex={1}>
                    <Tr
                      position="sticky"
                      top={0}
                      zIndex={1}
                      className="font-bold bg-[#f1f1f1]"
                    >
                      <Td>warehouse</Td>
                      <Td className="w-[250px]">city</Td>
                      <Td w={"130px"}>stock</Td>
                      <Td className="flex justify-center">action</Td>
                    </Tr>
                  </Thead>
                  <Tbody className="bg-white">
                    {stockDetail.map((val, idx) => {
                      return (
                        <Tr key={idx} className="bg-white">
                          <Td>{val.name}</Td>
                          <Td className="w-[250px]">{val.city}</Td>
                          <Td w={"130px"}>
                            {editMode[val.id] ? (
                              <Input
                                w={"80px"}
                                variant="filled"
                                value={editStock[val.id]}
                                onChange={(event) =>
                                  setEditStock({
                                    ...editStock,
                                    [val.id]: event.target.value,
                                  })
                                }
                              />
                            ) : (
                              <>{val.stock}</>
                            )}
                          </Td>
                          <Td className="flex justify-center gap-5">
                            {editMode[val.id] ? (
                              <Button
                                isDisabled={editStock[val.id] === ""}
                                colorScheme="teal"
                                variant={"ghost"}
                                onClick={() =>
                                  handleSaveStock(val.id, val.stock)
                                }
                              >
                                save
                              </Button>
                            ) : (
                              <>
                                <Button
                                  isDisabled={
                                    whAdmin !== "all" && whAdmin != val.id
                                  }
                                  colorScheme="messenger"
                                  variant={"ghost"}
                                  onClick={() => handleEditStock(val.id)}
                                >
                                  edit
                                </Button>
                                <Button
                                  isDisabled={
                                    whAdmin !== "all" && whAdmin != val.id
                                  }
                                  colorScheme="red"
                                  variant={"ghost"}
                                  onClick={onOpen}
                                >
                                  delete
                                </Button>
                                <AlertDialog
                                  isOpen={isOpen}
                                  leastDestructiveRef={cancelRef}
                                  onClose={onClose}
                                >
                                  <AlertDialogOverlay>
                                    <AlertDialogContent>
                                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Stock
                                      </AlertDialogHeader>

                                      <AlertDialogBody>
                                        Are you sure you want to delete stock from this warehouse?
                                      </AlertDialogBody>

                                      <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onClose}>
                                          Cancel
                                        </Button>
                                        <Button colorScheme='red' onClick={() => {handleDeletestock(val.id, val.stock);onClose()}} ml={3}>
                                          Delete
                                        </Button>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialogOverlay>
                                </AlertDialog>
                              </>
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
              <Modal isOpen={isModalOpen} onClose={handleModalClose} scrollBehavior={'inside'} size={'lg'}>
                  <ModalOverlay />
                  <ModalContent>
                      <ModalStock data={whList} uid={uid} id={product_id} close={handleModalClose}/>
                  </ModalContent>
              </Modal >
              <br />

              <Text className="font-ibmMed text-lg">Log</Text>
              <hr className="w-[100%] my-4 border-[2px]" />
              <TableContainer w={"full"}>
                <Table variant="simple">
                  <Thead>
                    <Tr className="font-bold bg-[#f1f1f1]">
                      <Td>created_at</Td>
                      <Td>old_value</Td>
                      <Td>new_value</Td>
                      <Td>warehouse</Td>
                      <Td>mutation_id</Td>
                      <Td>operator</Td>
                      <Td>operation</Td>
                    </Tr>
                  </Thead>
                  <Tbody className="bg-white">
                    {log.map((val, idx) => {
                      return (
                        <Tr key={idx} className="bg-white">
                          <Td>
                            {new Date(val.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                timeZoneName: "short",
                              }
                            )}
                          </Td>
                          <Td>{val.old_stock}</Td>
                          <Td>{val.new_stock}</Td>
                          <Td>{val.name}</Td>
                          <Td>{val.mutation_id}</Td>
                          <Td>{val.role}</Td>
                          <Td>{val.operation}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
              <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
                <IconButton
                  isDisabled={page === 1}
                  onClick={firstPageHandler}
                  size={"sm"}
                  bg="#5D5FEF"
                  aria-label="previous page"
                  icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
                />
                <IconButton
                  isDisabled={page === 1}
                  onClick={prevPageHandler}
                  size={"sm"}
                  bg="#5D5FEF"
                  aria-label="previous page"
                  icon={<TbChevronLeft color="white" boxsize={"16px"} />}
                />
                <div className="font-ibmReg text-dgrey">
                  Page {page} / {maxPage}
                </div>
                <IconButton
                  isDisabled={page === maxPage}
                  onClick={nextPageHandler}
                  size={"sm"}
                  bg="#5D5FEF"
                  aria-label="next page"
                  icon={<TbChevronRight color="white" boxsize={"16px"} />}
                />
                <IconButton
                  isDisabled={page === maxPage}
                  onClick={maxPageHandler}
                  size={"sm"}
                  bg="#5D5FEF"
                  aria-label="next page"
                  icon={<TbChevronsRight color="white" boxsize={"16px"} />}
                />
              </div>
              <br />
            </VStack>
          </Box>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default AdminProductDetail;
