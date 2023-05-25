/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 14:35:33
 * @Description:
 */
import { Button,Text } from "@chakra-ui/react"

import { useState, useMemo, useEffect } from "react"
import { utils, ethers } from "ethers"
import { useAccount } from "wagmi"
import smartPayrollFactoryAddress from "@/constants/smartPayrollFactoryAddress.json"
import smartPayrollFactoryABI from "@/constants/smartPayrollFactoryABI.json"
import { NETWORK } from "@/utils/config"
import KeeperAutoSelfRegisterAddress from "@/constants/KeeperAutoSelfRegisterAddress.json"
import smartPayrollByTimeABI from "@/constants/smartPayrollByTimeABI.json"
import ERC20ABI from "@/constants/ERC20ABI.json"
import { useRouter } from "next/router"
import { useTaskContext } from "@/contexts/taskProvider"
import { tokenList } from "@/utils/tokenList"

// interface ContractButtonProps {
//   addressInput: string
//   onChangeState: (newState: boolean) => void
//   onChangeUpkeeperContractAddress: (address: string) => void
//   registrarParams: Array<any>
//   upContractParams: Array<string | number | undefined>
// }

export default function TaskButton() {
  const [isLoad, setIsLoad] = useState(false)
  const [trigger, setTrigger] = useState("")
  const [isDepoist, setIsDepoist] = useState(false)
  const { address } = useAccount()
  const [upkeeperContract, setUpkeeperContract] = useState("")
  const taskParams = useTaskContext()
  const registrarParams = [
    taskParams.contractName,
    utils.formatBytes32String(taskParams.emailAddress || ""),
    taskParams.upkeeperContract,
    "500000",
    address,
    utils.formatBytes32String(""),
    utils.formatBytes32String(""),
    utils.parseUnits("0.5", 18),
  ]

  const upContractParams = [
    taskParams.intervalSeconds,
    taskParams.tokenAddress,
    address,
    taskParams.receiver,
    taskParams.roundValue,
  ]

  const signer = () => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      return signer
    }
  }

  const smartPayrollFactory = useMemo(() => {
    const currentSigner = signer()
    if (typeof window !== "undefined") {
      const smartPayrollFactory = new ethers.Contract(
        smartPayrollFactoryAddress[NETWORK],
        smartPayrollFactoryABI,
        currentSigner
      )
      return smartPayrollFactory
    }
  }, [])

  const erc20Token = useMemo(() => {
    const currentSigner = signer()
    if (typeof window !== "undefined") {
      const erc20Token = new ethers.Contract(taskParams.tokenAddress!, ERC20ABI, currentSigner)
      return erc20Token
    }
  }, [taskParams.tokenAddress])

  // const smartPayrollByTime = useMemo(() => {
  //   const currentSigner = signer()
  //   if (typeof window !== "undefined") {
  //     const smartPayrollByTime = new ethers.Contract(upkeeperContract, smartPayrollByTimeABI, currentSigner)
  //     return smartPayrollByTime
  //   }
  // }, [upkeeperContract])

  useEffect(() => {
    if (trigger == "trigger2") {
      const triggerTransfer = async () => {
        console.log(upkeeperContract)
        console.log(trigger)
        await transferToken()
      }
      triggerTransfer()
    }
  }, [trigger])

  const transferToken = async () => {
    const currentSigner = signer()
    const transferAmount = ethers.utils.parseUnits(
      (taskParams.tokenAmount! * taskParams.roundValue!).toString(),
      tokenList[taskParams.tokenNumber!].Symbol
    )
    console.log(erc20Token)
    console.log(address)
    try {
      if (taskParams.tokenAddress == "0x0000000000000000000000000000000000000000") {
        const tx = {
          to: upkeeperContract,
          value: transferAmount,
        }
        const receiptTx = await currentSigner!.sendTransaction(tx)
        await receiptTx?.wait()
      } else {
        const balance = await erc20Token?.balanceOf(address)
        console.log("msg.sender:", balance)
        console.log(transferAmount)
        if (balance >= transferAmount) {
          const transferTx = await erc20Token?.transfer(upkeeperContract, transferAmount)

          await transferTx?.wait()
        }
      }
      setIsLoad(false)
      setIsDepoist(true)
    } catch (e) {
      console.log(e)
    }
  }

  // useEffect(() => {
  //   if (trigger == "trigger3") {
  //     const triggerWithdraw = async () => {
  //       console.log(trigger)
  //       await withdrawToken()
  //     }
  //     triggerWithdraw()
  //   }
  // }, [trigger])

  // const withdrawToken = async () => {
  //   try {
  //     const balance1 = await smartPayrollByTime?.getTokenBalance(upkeeperContract, taskParams.tokenAddress)
  //     console.log("before:", utils.formatUnits(balance1, tokenList[taskParams.tokenNumber!].Symbol))

  //     const deetructTx = await smartPayrollByTime?.contractDestruct()
  //     await deetructTx.wait()
  //     const balance2 = await smartPayrollByTime?.getTokenBalance(upkeeperContract, taskParams.tokenAddress)
  //     console.log("after:", utils.formatUnits(balance2, tokenList[taskParams.tokenNumber!].Symbol))
  //     setIsLoad(false)
  //     setIsDepoist(true)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const createUpkeepContractHandle = async () => {
    setIsLoad(true)
    try {
      const amount = ethers.utils.parseUnits(
        taskParams.tokenAmount!.toString(),
        tokenList[taskParams.tokenNumber!].Symbol
      )

      console.log(smartPayrollFactory)
      let tx = await smartPayrollFactory?.createUpkeepContract(upContractParams, amount)
      const receipt = await tx.wait(1)

      const upKeeperContract = receipt.events[0].args[0]
      // taskParams.updateupkeeperContract(upKeeperContract)
      setUpkeeperContract(upKeeperContract)
      console.log("upkeep contract", upkeeperContract)
      setTrigger("trigger2")
      console.log(trigger)
    } catch (err) {
      console.log("create contract factory error:" + err)
    }
  }
  const createKeeperandle = async () => {
    setIsLoad(true)
    console.log("trigger3")

    console.log(registrarParams)
    taskParams.updateAdminAddress(address || "")
    try {
      let tx = await smartPayrollFactory?.createKeeper(KeeperAutoSelfRegisterAddress[NETWORK], registrarParams)

      const receipt = await tx.wait(1)

      const upKeepId = receipt.events[0].args[0]
      console.log("upkeep", upKeepId)

    } catch (err) {
      console.log("create contract factory error:" + err)
    }
    setIsLoad(false)
  }

  const testButton = async () => {
    console.log(taskParams.tokenAddress)
    const balance = await erc20Token?.balanceOf(address)
    console.log(balance)
  }

  // useEffect(()=>{
  //   console.log(registrarParams[2])
  //   if(registrarParams[2]!==undefined && trigger=='trigger3') {
  //     const fetchUpkeepContract = async ()=>{
  //       await createKeeperandle();
  //     }
  //     fetchUpkeepContract();
  //     setTrigger('trigger1')

  // }
  // },[registrarParams[2]])

  return (
    <>
      {!isDepoist ? (
        <>
        {isLoad ?<Text>The interaction with MetaMask has not yet ended</Text>:""}
        <Button
          isLoading={isLoad}
          loadingText="Submitting"
          colorScheme="teal"
          variant="solid"
          onClick={createUpkeepContractHandle}
        >
          Depoist token to contract
        </Button>
        </>
        
      ) : (
        <>
        {isLoad ?<Text>The interaction with MetaMask has not yet ended</Text>:""}
        <Button
          isLoading={isLoad}
          loadingText="Submitting"
          colorScheme="teal"
          variant="solid"
          onClick={createKeeperandle}
        >
          Submit
        </Button>
        </>
      )}
    </>
  )
}
