import {
  Heading, 
} from "@chakra-ui/react"

import CreateContract from '@/components/layout/CreateContract'
import Task from '@/components/layout/Task'
import {useTaskContext} from "@/contexts/taskProvider"

/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-23 19:59:33
 * @Description:
 */
export default function CreateTask() {
  const taskParams = useTaskContext();



  return (
    <div className=" pt-10 px-20">
      <Heading as="h1" size="2xl" mb="8">
        Create a new task
      </Heading>
      {!taskParams.haveContract?
      <CreateContract />
      :
      <Task/>}
      


    </div>
  )
}
