import { 
    Box
    , VStack
    , Icon
    , useRadio
    , Text
    , chakra
} from "@chakra-ui/react"
import * as giIcon from "react-icons/gi";


export default function CategoryRadio(props) {
    const { image, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(radioProps)
    
    const iconPlaceholder = giIcon[props.icon]
    /* console.log(props.func) */

    return (
        <chakra.label {...htmlProps} cursor='pointer'>
            <input name='searchCategory' {...getInputProps({ })}  hidden />
            <Box 
                onClick={props.func}
                name='searchCategory'
                {...getCheckboxProps()}
                bg={state.isChecked ? '#5D5FEF' : 'transparent'}
                className='w-[52px] h-[65px] flex justify-center rounded-md py-2'
            >
                <VStack {...getLabelProps()}>
                    <Icon as={iconPlaceholder} boxSize={'30px'} color={state.isChecked ? "white" : '#5D5FEF'} {...getLabelProps()}></Icon>
                    <Text className='text-[12px] text-center' color={state.isChecked ? "white" : 'black'} {...getLabelProps()}>{props.value}</Text>
                </VStack>
            </Box>
        </chakra.label>
        
    )
}
