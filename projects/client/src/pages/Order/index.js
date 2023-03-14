import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Order = (props) => {
  const navigate = useNavigate()
  const notLoggedIn = () => {
    try {
      if (!props.login) {
        toast.error('Please log in first. hehe', {
          duration: 3000,
        })
        navigate('/')
      } 
    } catch (error) {
      
    }
  }

  useEffect(() => {
      notLoggedIn()
  }, [])


  return (
    <div>
      This is order page! hehe
      <Toaster/>
    </div>
  )
}

export default Order