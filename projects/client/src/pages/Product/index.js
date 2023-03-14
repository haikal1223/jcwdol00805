import React from 'react'
import { useParams } from 'react-router-dom'

const Product = () => {
    const { id } = useParams()
  return (
    <div>
      This is product page {id}
    </div>
  )
}

export default Product
