/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-27 11:20:27
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
 import {createAuto} from '@/interact/createAuto'
 
export default function CreateRequest(){
  const [isLoad,setIsLoad]= useState(false);
  const [isLoadAuto,setIsLoadAuto]= useState(false);
  const signer= configProvider().getSigner();

  const buttonHandle= async ()=>{
    setIsLoad(true);
    await create();
    setIsLoad(false);
  }

  const buttonAutoHandle= async ()=>{
    setIsLoadAuto(true);
    await createAuto();
    setIsLoadAuto(false);
  }





  return(
    <>
    <div className='m-40'>
      <Button isLoading={isLoad} colorScheme='teal' variant='solid' onClick={buttonHandle} >sumbit</Button>
    </div>
    <div className='m-40'>
    <Button isLoading={isLoadAuto} colorScheme='teal' variant='solid' onClick={buttonAutoHandle} >autoSumbit</Button>
    </div>
    </>

  )
  
}