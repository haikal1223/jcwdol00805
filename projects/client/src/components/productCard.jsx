import {
    Image
    , Link
    , Button
} from "@chakra-ui/react"


export default function ProductCard(props) {
    return (


        <Link _hover={{ textDecoration: 'none' }}>
            <div className='bg-white hover:shadow-md h-[270px] w-[140px] rounded-2xl shadow-sm overflow-hidden' key={props.productIdx.idx}>
                <Link href={`/product/${props.productData.id}`} _hover={{ textDecoration: 'none' }}>
                    <Image alt="" src={props.productData.image_url} objectFit='cover' className='w-[140px] h-[147px]' />
                </Link>

                <div className='flex flex-col justify-between mt-2 gap-1 px-3'>
                    <Link href={`/product/${props.productData.id}`} _hover={{ textDecoration: 'none' }}>
                        <div className="font-ibmMed text-[14px] line-clamp-2 " >{props.productData.name}</div >
                    </Link>

                    <div className="flex items-baseline gap-1" >
                        <div className="font-ibmMed text-[12px] text-purple">Rp</div>
                        <div className="font-ibmMed text-[18px]">{props.productData.price.toLocaleString()}</div>
                    </div>
                    <Button
                        isDisabled={props.productData.total_stock === 0}
                        _disabled={{ bg: '#D9D9D9', color: '#9AA0B4', border: '0px', _hover: { bg: '#D9D9D9', color: '#9AA0B4', border: '0px' } }}
                        _hover={{ bg: 'white', color: '#5D5FEF', border: '1px', borderColor: '#5D5FEF' }}
                        h={'24px'}
                        bg='#5D5FEF'
                        color='white'
                        onClick={props.func}
                        zIndex={5} >
                        <div className="text-[12px]">
                            {props.productData.total_stock === 0 ? 'Out of stock' : 'Add to cart'}
                        </div>
                    </Button>

                </div>
            </div>
        </Link>



    )
}