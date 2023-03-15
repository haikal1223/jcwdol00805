import { 
    Image
    , Link 
    , Button
    , HStack
    , Text
} from "@chakra-ui/react"


export default function ProductCard(props) {
    return (
        <div className='bg-white h-[270px] w-[140px] rounded-2xl shadow-sm overflow-hidden' key={props.productIdx.idx}>
            <Image alt="" src={props.productData.image_url} objectFit='cover' className='w-[140px] h-[147px]'/>
            <div className='flex flex-col justify-between mt-2 gap-1 px-3'>
                <div className="font-ibmMed text-[14px] line-clamp-2 ">{props.productData.name}</div>
                <div className="flex items-baseline gap-1">
                    <div className="font-ibmMed text-[12px] text-purple">Rp</div>
                    <div className="font-ibmMed text-[18px]">{props.productData.price.toLocaleString()}</div>
                </div>
                <Button h={'24px'} bg='#5D5FEF' color='white'>
                    <div className="text-[12px]">Add to cart</div> 
                </Button>
            </div>
        </div>
    )
}

