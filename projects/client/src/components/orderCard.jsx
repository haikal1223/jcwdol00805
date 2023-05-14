import {
  Image,
  Link,
  Button,
  Box,
  HStack,
  VStack,
  Text,
  Container,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderCard(props) {
  let totalPrice = props.orderData.paid_amount + props.orderData.shipping_cost;
  const [paymentInputMode, setPaymentInputMode] = useState(false);
  const [file, setFile] = useState("");
  const toast = useToast();
  const Navigate = useNavigate();

  let changePaymentInputMode = () => {
    setPaymentInputMode(!paymentInputMode);
  };

  let handleImage = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  let handleUploadImage = async () => {
    try {
      if (file) {
        let formData = new FormData();
        formData.append("payments", file);
        await axios.patch(
          `http://localhost:8000/order/upload-payment?id=${props.orderData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast({
          title: "Your payment proof is uploaded!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          Navigate(0);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error in upload payment proof",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Box
        w="full-60px"
        mx="30px"
        mt="30px"
        p="20px"
        borderWidth="1px"
        borderRadius="15px"
      >
        <HStack width="full">
          <VStack align="stretch" width="full">
            <HStack width="full" className="flex justify-between">
              <HStack>
                <Text fontSize={16} fontWeight={700} className="font-ibmFont ">
                  {props.orderData.order_status.status}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize={14} fontWeight={400} className="font-ibmFont ">
                  #{props.orderData.id}
                </Text>
              </HStack>
            </HStack>
            <HStack width="full" className="flex justify-between">
              <HStack>
                <Text fontSize={16} fontWeight={700} className="font-ibmFont ">
                  Total
                </Text>
              </HStack>
              <HStack>
                <Text fontSize={24} fontWeight={400} className="font-ibmFont ">
                  Rp{totalPrice.toLocaleString("id-ID")}
                </Text>
              </HStack>
            </HStack>
            {props.orderData.order_status_id === 1 ? (
              <>
                <Box display="flex" justifyContent="start">
                  <Button
                    bg="#5D5FEF"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="125px"
                    height="43px"
                    onClick={props.orderDetail}
                  >
                    Order Detail
                  </Button>
                  <Button
                    bg="#5D5FEF"
                    borderRadius="28.5px"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    color="white"
                    width="155px"
                    height="43px"
                    ml="10px"
                    onClick={changePaymentInputMode}
                    // onClick={props.uploadPayment}
                  >
                    Upload Payment
                  </Button>
                  <Button
                    bg="#ff3838"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="75px"
                    height="43px"
                    ml="10px"
                    onClick={props.cancel}
                  >
                    Cancel
                  </Button>
                </Box>
                {paymentInputMode ? (
                  <>
                    <Box bg="gray.400" borderRadius="10px">
                      <FormControl my="10px" mx="10px" pr="20px">
                        <Input
                          rounded="lg"
                          variant="filled"
                          placeholder="File"
                          type="file"
                          p={["2pt"]}
                          onChange={(e) => handleImage(e)}
                          id="img"
                          mb="10px"
                        />
                        <Box display="flex" justifyContent="center">
                          <Button
                            bg="#ff3838"
                            boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                            borderRadius="28.5px"
                            color="white"
                            width="75px"
                            height="43px"
                            onClick={changePaymentInputMode}
                          >
                            Cancel
                          </Button>
                          <Button
                            bg="#5D5FEF"
                            borderRadius="28.5px"
                            boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                            color="white"
                            width="155px"
                            height="43px"
                            ml="10px"
                            onClick={(e) => handleUploadImage()}
                          >
                            Upload Payment
                          </Button>
                        </Box>
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : props.orderData.order_status_id === 4 ? (
              <>
                <Box display="flex" justifyContent="start">
                  <Button
                    bg="#5D5FEF"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="150px"
                    height="43px"
                    mr="10px"
                    onClick={props.orderDetail}
                  >
                    Order Detail
                  </Button>
                  <Button
                    bg="#5D5FEF"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="150px"
                    height="43px"
                    onClick={props.delivered}
                  >
                    Order Delivered
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Button
                  bg="#5D5FEF"
                  boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                  borderRadius="28.5px"
                  color="white"
                  width="150px"
                  height="43px"
                  onClick={props.orderDetail}
                >
                  Order Detail
                </Button>
              </>
            )}
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
