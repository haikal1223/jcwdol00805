import {
  Image,
  Link,
  Button,
  Box,
  HStack,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";
import { DeleteIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function OrderCard(props) {
  let totalPrice = props.orderData.paid_amount + props.orderData.shipping_cost;

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
            {props.orderData.order_status.status === "Pending Payment" ? (
              <>
                <Box display="flex" justifyContent="space-evenly">
                  <Button
                    bg="#ff3838"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="75px"
                    height="43px"
                    onClick={props.cancel}
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
                    onClick={props.uploadPayment}
                  >
                    Upload Payment
                  </Button>
                  <Button
                    bg="#5D5FEF"
                    boxShadow="0px 20px 30px rgba(211,209,216, 0.521)"
                    borderRadius="28.5px"
                    color="white"
                    width="125px"
                    height="43px"
                    ml="10px"
                    onClick={props.orderDetail}
                  >
                    Order Detail
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
