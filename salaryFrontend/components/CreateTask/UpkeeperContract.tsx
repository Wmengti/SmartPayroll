/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-29 19:24:58
 * @Description:
 */
import {
  Text,
  Box,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Image from "next/image";
import { tokenList } from "@/utils/tokenList";

import { useTaskContext } from "@/contexts/taskProvider";
import UpkeeperButton from "@/components/CreateTask/UpkeeperButton";
import { useEffect } from "react";
import { ethers } from "ethers";

/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-20 11:21:32
 * @Description:
 */
export default function UpkeeperContract() {
  const taskParams = useTaskContext();

  return (
    <>
      <Text fontSize="xl" mb="8">
        The last step is to send your contract to the chainlink automation
        platform
      </Text>
      <Box
        bg="gray.200"
        maxW="2xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="10"
      >
        <form className="flex flex-col gap-5 items-center ">
          <Image
            width={300}
            height={300}
            src={taskParams.image!}
            alt="contract NFT"
          />

          <UpkeeperButton />
        </form>
      </Box>
    </>
  );
}
