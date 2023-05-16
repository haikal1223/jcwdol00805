import { Box, IconButton, Card, CardHeader, CardFooter, CardBody, Badge, Heading, Text, Button, Image, Stack, Divider, ButtonGroup, Spacer, HStack } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';







const AddressCard = (props) => {





    const splitText = (text) => {
        if (text) {
            return text.split(".")[1];
        } else {
            return "";
        }
    };

    return (
        <Card w='full' variant='outline' color={'#5D5FEF'} bg={'#D9D9D9'} >
            <CardBody>
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>
                        {props.addressData.recipient_name}{' '}
                        {props.addressData.main_address ? <Badge variant='outline' color={'#5D5FEF'}>Main</Badge> : <></>}
                    </Heading>
                    <HStack w="full">
                        <Text w="full" color={'black'}>
                            <p>{props.addressData?.recipient_phone}</p>
                            <p>{props.addressData?.street_address}</p>
                            <p>
                                {props.addressData?.subdistrict}, {splitText(props.addressData?.city)},{" "}
                                {splitText(props.addressData?.province)}
                            </p>
                            <p>{props.addressData?.postal_code}</p>
                        </Text>

                        <ButtonGroup spacing='2' justifyContent='flex-end' ml='auto'>
                            <Stack>

                                <Button variant='ghost' color={'#FCFCFD'} bg={"#FF3838"} onClick={props.handleDelete}>
                                    delete
                                </Button>
                            </Stack>
                        </ButtonGroup>
                    </HStack>
                </Stack>
            </CardBody>


        </Card>
    );
};

export default AddressCard;



