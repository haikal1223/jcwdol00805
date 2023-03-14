import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Cart = (props) => {
  const navigate = useNavigate()
  const notLoggedIn = () => {
    if (!props.login) {
        toast.error('Please log in first.', {
          duration: 3000,
        })
        navigate('/')
      } 
  }

  useEffect(() => {
    notLoggedIn()
  }, [])

  return (
    <div>
      This is cart page!aa
      <Toaster/>
    </div>
  )
}

export default Cart
