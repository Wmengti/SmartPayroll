import {
  Heading, 
} from "@chakra-ui/react"

import CreateContract from '@/components/CreateTask/CreateContract'
import WriteContract from '@/components/CreateTask/WriteContract'
import UpkeeperContract from '@/components/CreateTask/UpkeeperContract'
import {useTaskContext} from "@/contexts/taskProvider"
import { useEffect } from "react"

/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-31 10:28:41
 * @Description:
 */
export default function CreateTask() {
  const taskParams = useTaskContext();

  console.log("what",taskParams.buttonType)
  useEffect(()=>{
    taskParams.updateButtonType('create')
  },[])


  return (
    <div className=" pt-10 px-20">
      <Heading as="h1" size="2xl" mb="8">
        Create a new task
      </Heading>
      {taskParams.buttonType =='create' &&
      <CreateContract />}
      {taskParams.buttonType =='write' &&
      <WriteContract />}
      {taskParams.buttonType =='upkeeper' &&
      <UpkeeperContract />}
      
      


    </div>
  )
}
