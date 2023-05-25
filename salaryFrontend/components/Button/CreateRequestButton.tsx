/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 13:16:53
 * @Description: 
 */
import {
  Button,
  IconButton
} from '@chakra-ui/react'
import { useState
 } from 'react';
 import {configProvider} from '@/utils/config';
 import {create} from '@/interact/create'
 
export default function CreateRequest(){
  const [isLoad,setIsLoad]= useState(false);
  const signer= configProvider().getSigner();

  const buttonHandle= async ()=>{
    setIsLoad(true);
    await create();
    setIsLoad(false);
  }






  return(
    <div className='m-40'>
      <Button isLoading={isLoad} colorScheme='teal' variant='solid' onClick={buttonHandle} >sumbit</Button>
    </div>

  )
  
}