import {
  Text,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  HStack,
  Radio,
  Textarea,
  ButtonGroup,
  Button,
  IconButton,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import ContractButton from "@/components/Button/ContractButton"
import {useTaskContext} from "@/contexts/taskProvider"
/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-20 11:21:32
 * @Description:
 */


export default function CreateContract() {

  const taskParams = useTaskContext();
  const [EmailIsError, setEmailIsError] = useState(false)
  const [addressError,setAddressError]= useState(false)

  const emailInputHandler = (e: any) => {
    const reEmail =
      /^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i
      taskParams.updateEmailAddress(e.target.value)
    if (e.target.value && reEmail.test(e.target.value)) {
      setEmailIsError(false)
    } else {
      setEmailIsError(true)
    }
    console.log(e.target.value)
  }

  const contractSubmitHander = (e: any) => {
    e.preventDefault()
    //aws data
  }
  const addressInputHandler = (e: any) => {
    taskParams.updateReceiver(e.target.value)
    if (e.target.value.length == 42) {
      setAddressError(false)
    } else {
      setAddressError(true)
    }
    console.log(e.target.value)
  }

  const nameInputHandler = (e: any) => {
    taskParams.updateContractName(e.target.value)
    console.log(e.target.value)
  }
  const workHandler = (e: any) => {
    taskParams.updateWorkType(e)
    console.log(e)
  }

 


  return (
   <>
      <Text fontSize="xl" mb="8">
        Establish your partnership by creating a payroll contract
      </Text>
      <Box bg="gray.200" maxW="2xl" borderWidth="1px" borderRadius="lg" overflow="hidden" p="10">
        <form className="flex flex-col gap-5" onSubmit={contractSubmitHander}>
          <FormControl isRequired>
            <FormLabel>Contract Name</FormLabel>
            <Input
              type="name"
              bg="white"
              placeholder="Solidity developer"
              onChange={nameInputHandler}
              value={taskParams.contractName}
            />
          </FormControl>
          <FormControl isRequired isInvalid={EmailIsError}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              bg="white"
              placeholder="example@email.com"
              onChange={emailInputHandler}
              value={taskParams.emailAddress}
            />
            {EmailIsError ? <FormErrorMessage>email is wrong.</FormErrorMessage> : <FormHelperText></FormHelperText>}
          </FormControl>
          <FormControl isRequired isInvalid={addressError}>
            <FormLabel>Employee Address</FormLabel>
            <Input
              type="Contract Address"
              bg="white"
              placeholder="0x..."
              onChange={addressInputHandler}
              value={taskParams.receiver}
            />
            {addressError ? (
              <FormErrorMessage>Employee address is wrong.</FormErrorMessage>
            ) : (
              <FormHelperText></FormHelperText>
            )}
          </FormControl>
          <FormControl as="fieldset" isRequired>
            <FormLabel as="legend">Type of Work</FormLabel>
            <RadioGroup defaultValue="fulltime" value={taskParams.workType} onChange={workHandler}>
              <HStack spacing="24px">
                <Radio value="fulltime" bg="white">
                  fulltime
                </Radio>
                <Radio value="parttime" bg="white">
                  parttime
                </Radio>
                <Radio value="bounty" bg="white">
                  bounty
                </Radio>
                <Radio value="none of the above" bg="white">
                  none of the above
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Describe the Contract Contents (Optional)</FormLabel>
            <Textarea placeholder="Here is a sample placeholder" bg="white" />
          </FormControl>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button bg="gray.300">Upload Contract Content by Taking a Photo(Optional)</Button>
            <IconButton bg="white" aria-label="Add to friends" icon={<AddIcon />} />
          </ButtonGroup>
          
          <ContractButton />
        </form>
      </Box>
      </>
  )
}
