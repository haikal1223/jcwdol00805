
import { Stack, VStack, HStack, Text, Input, Image, Button, Icon, IconButton, SimpleGrid, useRadio, useRadioGroup, Box } from '@chakra-ui/react';
import {TbSearch, TbDots, TbArrowNarrowLeft, TbArrowNarrowRight} from 'react-icons/tb'
import { GiLargeDress, GiUnderwearShorts, GiSlippers, GiConverseShoe, GiPoloShirt, GiPerson } from "react-icons/gi";
import ProductCard from '../components/productCard';
import CategoryRadio from '../components/category';
import { useEffect, useState } from 'react';
import axios from 'axios'

export default function Home() {

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const [filter, setFilter] = useState({
        searchProductName: '',
        searchCategory: '' 
    })
    const [filteredProducts, setFilteredProducts] = useState([])
    const itemLimit = 10

    // fetch & render
    const fetchProduct = async() => {
        try {
            let response = await axios.get(`http://localhost:8000/product/view`)
            setProducts(response.data.data[0])
            setMaxPage(Math.ceil(response.data.data[0].length / itemLimit))
            setFilteredProducts(response.data.data[0])
            //console.log(response.data.data[0])
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    const renderProduct = () => {
        const startIndex = (page - 1) * itemLimit
        const productPerPage = filteredProducts.slice(startIndex, startIndex + itemLimit)
        
        return productPerPage.map((val, idx) => {
            return (
                <ProductCard productData={val} productIdx={idx} />
            )
        })
    }

    // pagination
    const nextPageHandler = () => {
        setPage(page + 1)
    }

    const prevPageHandler = () => {
        if(page > 1) {
            setPage(page - 1)
        }
    }

    // search & filter
    const searchInputHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFilter({
            ...filter
            , [name]: value
        })
        console.log(e)
    }

    /* const categoryInputHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFilter({
            ...filter
            , [name]: value
        })
        console.log(e)
    } */

    const searchButtonHandler = () => {
        const filterResult = products.filter((val) =>{
            return val.name.toLowerCase().includes(filter.searchProductName.toLowerCase())
        })

        setFilteredProducts(filterResult)
        setPage(1)
        setMaxPage(Math.ceil(filterResult.length / itemLimit))
    }

    // category as Radio
    const categories = [
        { name: 'All', icon:'GiPerson' },
        { name: 'Dress', icon:'GiLargeDress' },
        { name: 'Sandal', icon:'GiSlippers' },
        { name: 'Topwear', icon:'GiPoloShirt' },
        { name: 'Bottom', icon:'GiUnderwearShorts' },
        { name: 'Shoes', icon:'GiConverseShoe' }
    ]
    

    const renderCategory = () => {
        return (
            <Stack {...getRootProps()}>
                <div className='flex justify-between'>
                    {categories.map((val) => {
                    return (
                        <CategoryRadio
                        key={val.name}
                        func={searchInputHandler}
                        icon={val.icon}
                        name='searchCategory'
                        {...getRadioProps({ value: val.name })}
                        />
                    )
                    })}
                </div>
            </Stack>
        )
    }

    const { value, getRadioProps, getRootProps } = useRadioGroup({
        defaultValue: 'All'
    })
    


    return (
        <div className='flex justify-center z-5'>
            <div className="w-[375px] h-[2066px] flex flex-col items-center">
                
                    <div className='w-[375px] h-[119px]'>
                        <Carousel showThumbs={false} showStatus={false} className='z-5'>
                            <div>
                                <img src={banner1} />
                            </div>
                            <div>
                                <img src={banner2} />
                            </div>
                            <div>
                                <img src={banner3} />
                            </div>
                        </Carousel>
                    </div>
                    <div className='w-[348px] h-[198px] flex flex-col justify-between items-center gap-3 bg-white rounded-md p-5 shadow-md z-10 mt-[50px]'>
                        <div className='font-ibmBold text-[20px] text-dgrey'>
                            What are you looking?
                        </div>
                            
                        <div className='w-[100%] flex justify-between items-center gap-2 mb-1'>
                            <Input name='searchProductName' onChange={searchInputHandler} placeholder='Find your favorite product' className='p-1' />
                            <IconButton onClick={searchButtonHandler} bg='#5D5FEF' aria-label='search product' icon={<TbSearch color='white'/>}/>
                        </div>
                            
                        {renderCategory()}

                        {/* <div className='flex justify-between'>
                            <Box className='w-[52px] h-[60px] flex justify-center rounded-md'>
                                <VStack>
                                    <Icon as={GiPerson} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>All</div>
                                </VStack>
                            </Box>
                            <div className='w-[52px] h-[79px] flex justify-center'>
                                <VStack>
                                    <Icon as={GiLargeDress} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>Dress</div>
                                </VStack>
                            </div>
                            <div className='w-[52px] h-[79px] flex justify-center'>
                                <VStack>
                                    <Icon as={GiSlippers} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>Sandal</div>
                                </VStack>
                            </div>
                            <div className='w-[52px] h-[79px] flex justify-center'>
                                <VStack>
                                    <Icon as={GiPoloShirt} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>Topwear</div>
                                </VStack>
                            </div>
                            <div className='w-[52px] h-[79px] flex justify-center'>
                                <VStack>
                                    <Icon as={GiUnderwearShorts} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>Bottom</div>
                                </VStack>
                            </div>
                            <div className='w-[52px] h-[79px] flex justify-center'>
                                <VStack>
                                    <Icon as={GiConverseShoe} boxSize={'30px'} color={'#5D5FEF'}/>
                                    <div className='text-[12px] text-center'>Shoes</div>
                                </VStack>
                            </div>
                        </div> */}
                    </div>
                    <div className='mt-10 flex flex-col justify-start gap-5'>
                        <div className='font-ibmMed text-[18px]'>Daily Discover</div>
                        <div className=''>
                            <SimpleGrid columns={2} spacing={10}>
                                {renderProduct()}
                            </SimpleGrid>
                        </div>
                        <div className='flex justify-center items-center gap-5'>
                            <IconButton disabled={page === 1} onClick={prevPageHandler} size={'sm'} bg='#5D5FEF' aria-label='previous page' icon={<TbArrowNarrowLeft color='white' boxsize={'16px'}/>}/>
                                <div className='font-ibmReg text-dgrey'>Page {page} / {maxPage}</div>
                            <IconButton onClick={nextPageHandler} size={'sm'} bg='#5D5FEF' aria-label='next page' icon={<TbArrowNarrowRight color='white' boxsize={'16px'}/>}/>
                        </div>
                    </div>
            </div>
        </div>
        
    )
}