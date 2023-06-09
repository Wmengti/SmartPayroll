/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-12 17:38:44
 * @Description:
 */
import { Button, Text } from "@chakra-ui/react";

import { useState, useMemo, useEffect } from "react";
import { utils, ethers } from "ethers";
import { useAccount } from "wagmi";
import smartPayrollFactoryAddress from "@/constants/smartPayrollFactoryAddress.json";
import smartPayrollFactoryABI from "@/constants/smartPayrollFactoryABI.json";
import { NETWORK } from "@/utils/config";
import keeperAutoSelfRegisterAddress from "@/constants/keeperAutoSelfRegisterAddress.json";

import smartPayrollByTimeABI from "@/constants/smartPayrollByTimeABI.json";
import ERC20ABI from "@/constants/ERC20ABI.json";
import { useRouter } from "next/router";
import { useTaskContext } from "@/contexts/taskProvider";
import { tokenList } from "@/utils/tokenList";
import { ContractModel } from "@/types/types";
import { toast } from "react-toastify";
// import {configProvider} from '@/utils/config';

// interface ContractButtonProps {
//   addressInput: string
//   onChangeState: (newState: boolean) => void
//   onChangeUpkeeperContractAddress: (address: string) => void
//   registrarParams: Array<any>
//   upContractParams: Array<string | number | undefined>
// }

export default function WriteButton() {
  const router = useRouter();
  // const localsigner= configProvider().getSigner();
  const [isSecondLoad, setIsSecondLoad] = useState(false);

  const { address } = useAccount();

  const taskParams = useTaskContext();
  const registrarParams = [
    `${taskParams.contractName}_upkeeper`,
    utils.formatBytes32String(taskParams.emailAddress || ""),
    taskParams.upkeeperContract,
    "500000",
    "0xb1BfB47518E59Ad7568F3b6b0a71733A41fC99ad",
    utils.formatBytes32String(""),
    utils.formatBytes32String(""),
    utils.parseUnits("0.5", 18),
  ];

  const signer = () => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return signer;
    }
  };

  const smartPayrollFactory = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== "undefined") {
      const smartPayrollFactory = new ethers.Contract(
        smartPayrollFactoryAddress[NETWORK],
        smartPayrollFactoryABI,
        currentSigner
      );
      return smartPayrollFactory;
    }
  }, []);

  const uploaData: ContractModel = {
    contractAddress: taskParams.contractAddress,
    admin: address!,
    contractName: taskParams.contractName,
    Email: taskParams.emailAddress,
    receiver: taskParams.receiver,
    workType: taskParams.workType,
    description: taskParams.description,
    token: tokenList[taskParams.tokenNumber].Token,
    amount: taskParams.tokenAmount,
    timeUint: taskParams.timeUnitValue,
    timeInterval: taskParams.timeIntervalValue,
    round: taskParams.roundValue,
    state: taskParams.contractState,
    proposal: taskParams.proposal,
    proposalID: taskParams.proposalID,
    endTime: taskParams.endTime,
    upkeeperContract: taskParams.upkeeperContract,
    upKeepId: taskParams.upKeepId,
    image: taskParams.image,
    DAOAddress: taskParams.DAOAddress,
  };

  const fetchHandler = async (uploaData: ContractModel) => {
    console.log(uploaData);
    const response = await fetch("/api/connectDB", {
      method: "POST",
      body: JSON.stringify(uploaData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();

    console.log(res);
  };
  useEffect(() => {
    if (taskParams.upKeepId != "" && taskParams.contractState != "") {
      const actionFetch = async () => {
        await fetchHandler(uploaData);
        console.log(uploaData);
        taskParams.updateButtonType("check");
        router.push(`/CheckMoment/${address}`);
      };
      actionFetch();
    }
  }, [taskParams.upKeepId, taskParams.contractState]);

  const createKeeperandle = async () => {
    setIsSecondLoad(true);
    console.log("trigger3");

    console.log(registrarParams);
    taskParams.updateAdminAddress(address || "");
    try {
      let tx = await smartPayrollFactory?.createKeeper(
        keeperAutoSelfRegisterAddress[NETWORK],
        registrarParams
      );

      const receipt = await tx.wait(1);
      const upKeepId = BigInt(receipt.events[3].topics[1]).toString();
      console.log("upkeep============", typeof upKeepId);
      console.log("upkeep", upKeepId);
      taskParams.updateUpKeepId(upKeepId);
      taskParams.updateContractState("active");
    } catch (err) {
      console.log("create contract factory error:" + err);
      toast("create contract factory error:" + err, {
        position: "top-center",
        autoClose: 5000,
      });
    }
    setIsSecondLoad(false);
  };
  const testButton = async () => {
    console.log(uploaData);
    await fetchHandler(uploaData);
  };

  return (
    <>
      {isSecondLoad ? (
        <Text>The interaction with MetaMask has not yet ended</Text>
      ) : (
        ""
      )}
      <Button
        isLoading={isSecondLoad}
        loadingText="Submitting"
        colorScheme="teal"
        variant="solid"
        onClick={createKeeperandle}
      >
        Submit
      </Button>
    </>
  );
}
