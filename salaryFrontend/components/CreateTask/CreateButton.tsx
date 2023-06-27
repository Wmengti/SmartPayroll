/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-12 17:38:29
 * @Description:
 */
import { Button } from "@chakra-ui/react";

import { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import contractNFTAddress from "@/constants/contractNFTFactoryAddress.json";
import contractNFTABI from "@/constants/contractNFTFactoryABI.json";
import { NETWORK } from "@/utils/config";
import { useTaskContext } from "@/contexts/taskProvider";
import { toast } from "react-toastify";

export default function CreateButton(props: any) {
  const taskParams = useTaskContext();
  const [isLoad, setIsLoad] = useState(false);
  const contractNFTFactory = useMemo(() => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractNFTFactory = new ethers.Contract(
        contractNFTAddress[NETWORK],
        contractNFTABI,
        signer
      );
      return contractNFTFactory;
    }
  }, []);

  const contractNFTHandle = async () => {
    console.log("trigger1");

    setIsLoad(true);
    try {
      const tx = await contractNFTFactory?.createTask(
        taskParams.receiver,
        taskParams.contractName
      );
      const receiptTx = await tx.wait(1);
      taskParams.updateButtonType("write");
      console.log("address", receiptTx.events[0].address);
      taskParams.updateContractAddress(receiptTx.events[0].address);
    } catch (err) {
      console.log("create contract factory error:" + err);
      toast("Employee Address cannot be the same as your address. ", {
        position: "top-center",
        autoClose: 5000,
      });
    }
    setIsLoad(false);
  };

  return (
    <>
      <Button
        isLoading={isLoad}
        isDisabled={props.isDisabled}
        loadingText="Submitting"
        colorScheme="teal"
        variant="solid"
        onClick={contractNFTHandle}
      >
        Submit
      </Button>
    </>
  );
}
