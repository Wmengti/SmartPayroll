import {
  Text,
  Box,
  FormLabel,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { tokenList } from "@/utils/tokenList";

import { useTaskContext } from "@/contexts/taskProvider";
import WriteButton from "@/components/CreateTask/WriteButton";
import { useEffect } from "react";
import FaucetButton from "@/components/CreateTask/FaucetButton";

/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-20 11:21:32
 * @Description:
 */
export default function WriteContract() {
  const taskParams = useTaskContext();

  const tokenSelectHandler = (e: any) => {
    taskParams.updateTokenNumber(e.target.value);
    console.log(tokenList[e.target.value].Address);
    taskParams.updateTokenAddress(tokenList[e.target.value].Address);
    console.log(e.target.value);
  };

  const amountTokenHandler = (e: any) => {
    taskParams.updateTokenNumber(0);
    taskParams.updateTokenAddress(tokenList[0].Address);
    taskParams.updateTokenAmount(e);
    console.log(taskParams.tokenAddress);
    console.log(e);
  };
  const timeUintValueHandler = (e: any) => {
    taskParams.updateTimeUnitValue(e.target.value);
    console.log(e.target.value);
  };
  const timeIntervalValueHandler = (e: any) => {
    taskParams.updateTimeIntervalValue(e);
    console.log(e);
  };
  const roundValueHandler = (e: any) => {
    taskParams.updateRoundValue(e);
    console.log(e);
  };

  useEffect(() => {
    taskParams.updateIntervalSeconds(
      taskParams.timeUnitValue!,
      taskParams.timeIntervalValue!
    );
  }, [taskParams.timeUnitValue, taskParams.timeIntervalValue]);

  return (
    <>
      <Text fontSize="xl" mb="8">
        The contract has been created. Now, set the details for your scheduled
        task and deposit the funds to be distributed
      </Text>
      <Box
        bg="gray.200"
        maxW="2xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="10"
      >
        <form className="flex flex-col gap-5">
          <div className="flex gap-10">
            <div className="flex flex-col  ">
              <FormLabel as="legend">Token</FormLabel>
              <Select
                width="fit-content"
                bg="white"
                value={0}
                onChange={tokenSelectHandler}
              >
                {tokenList.map((list: any, index: number) => (
                  <option key={index} value={list.Number}>
                    {list.Token}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col ">
              <FormLabel as="legend">Amount</FormLabel>
              {/* <Input type="Number" bg="white" placeholder="Number" width="fit-content" /> */}
              <NumberInput
                bg="white"
                width="40"
                min={0}
                value={taskParams.tokenAmount}
                onChange={amountTokenHandler}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <FaucetButton />
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col  ">
              <FormLabel as="legend">Time Unit</FormLabel>
              <Select
                placeholder="Select option"
                width="fit-content"
                bg="white"
                value={taskParams.timeUnitValue}
                onChange={timeUintValueHandler}
              >
                <option value="Month">Month</option>
                <option value="Day">Day</option>
                <option value="Hour">Hour</option>
                <option value="Minute">Minute</option>
              </Select>
            </div>
            <div className="flex flex-col ">
              <FormLabel as="legend">Time Interval</FormLabel>
              <NumberInput
                bg="white"
                width="40"
                min={0}
                onChange={timeIntervalValueHandler}
                value={taskParams.timeIntervalValue}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div className="flex flex-col ">
              <FormLabel as="legend">Round</FormLabel>
              <NumberInput
                bg="white"
                width="40"
                min={0}
                onChange={roundValueHandler}
                value={taskParams.roundValue}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
          </div>

          <WriteButton />
        </form>
      </Box>
    </>
  );
}
