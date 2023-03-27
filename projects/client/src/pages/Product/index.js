import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Box, Card, Button, ButtonGroup, Image, IconButton } from '@chakra-ui/react'

import axios from "axios"
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

const Product = () => {
  let [productData, setProductData] = useState([])




  let getProductDetail = async () => {
    try {
      let getProductDetail = await axios.get(
        `http://localhost:8000/product/detail/${id}`
      );
      setProductData(getProductDetail.data.data[0])
    } catch (error) { }
  };



  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    getProductDetail()
  }, [])

  const { id } = useParams()
  return (
    <div>
      <Card maxW='sm'>
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden'>

          <Image h='200px' w='full' p='2'
            objectFit='contain' src={productData.image_url} />

          {productData.name}

          <Box p='5'>
            <Box w='full' as='button' mt={10}>
              <ButtonGroup spacing='2'>
                <IconButton
                  aria-label='decrease quantity'
                  icon={<MinusIcon />}
                  onClick={() => handleQuantityChange('decrease')}
                  size='sm'
                  variant='outline'
                  isDisabled={quantity === 1}
                />
                <Button w='full' bg='blue.600' color='white' _hover={{ color: 'blue.500', bg: "white", border: '1px solid skyblue' }} >ADD TO CART ({quantity})</Button>
                <IconButton
                  aria-label='increase quantity'
                  icon={<AddIcon />}
                  onClick={() => handleQuantityChange('increase')}
                  size='sm'
                  variant='outline'
                />
              </ButtonGroup>
            </Box>

          </Box>
        </Box>
      </Card>
    </div>
  )
}

export default Product