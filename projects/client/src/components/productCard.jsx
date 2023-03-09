import { 
    Image
    , Link 
    , Button
    , HStack
    , Text
} from "@chakra-ui/react"


export default function ProductCard(props) {
    return (
        <div className='bg-white h-[250px] w-[154px] rounded-2xl shadow-sm overflow-hidden' key={props.productIdx.idx}>
            <Image alt="" src={props.productData.image_url} objectFit='cover' className='w-[154px] h-[147px]'/>
            <div className='flex flex-col justify-between gap-1 px-2'>
                <div className="font-ibmMed text-[14px] truncate ...">{props.productData.name}</div>
                <div className="flex items-baseline">
                    <div className="font-ibmReg text-[10px] text-purple">Rp</div>
                    <div className="font-ibmMed text-[20px]">{props.productData.price}</div>
                </div>
                <Button h={'24px'} bg='#5D5FEF' color='white'>
                    <div className="text-[12px]">Add to cart</div> 
                </Button>
            </div>
        </div>
    )
}

