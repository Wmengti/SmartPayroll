/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-22 18:31:27
 * @Description:
 */
import { Button } from "@chakra-ui/react"

import { useState, useMemo,useEffect } from "react"
import { ethers } from "ethers"
import smartPayrollFactoryAddress from "@/constants/smartPayrollFactoryAddress.json"
import smartPayrollFactoryABI from "@/constants/smartPayrollFactoryABI.json"
import { NETWORK } from "@/utils/config"
import {useTaskContext} from "@/contexts/taskProvider"


export default function ContractButton() {
  const taskParams = useTaskContext();
  const [isLoad, setIsLoad] = useState(false)
  const smartPayrollFactory = useMemo(() => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const smartPayrollFactory = new ethers.Contract(
        smartPayrollFactoryAddress[NETWORK],
        smartPayrollFactoryABI,
        signer
      )
      return smartPayrollFactory
    }
  }, [])

  const contractNFTHandle = async () => {
    console.log("trigger1")
    setIsLoad(true)
    try {
      let tx = await smartPayrollFactory?.createTask(taskParams.receiver)
      tx.wait(1)
      taskParams.updateHaveContract(true)
      
    } catch (err) {
      console.log("create contract factory error:" + err)
    }
    setIsLoad(false)
  }



  return (
    <Button isLoading={isLoad} loadingText="Submitting" colorScheme="teal" variant="solid" onClick={contractNFTHandle}>
      Submit
    </Button>
  )
}
