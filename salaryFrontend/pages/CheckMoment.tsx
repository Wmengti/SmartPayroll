/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 16:08:18
 * @Description: 
 */
import {
  Button,
  IconButton
} from '@chakra-ui/react'
import { useState
 } from 'react';

import CreateRequest from '@/components/Button/CreateRequestButton'
export default function CheckMoment(){

  const [isLoad,setIsLoad]= useState(false);

  const buttonHandle=()=>{
    setIsLoad(true)
  }

  return(
    <div className='mt-10 mx-10'>
    <CreateRequest />
    </div>

  )
  
}