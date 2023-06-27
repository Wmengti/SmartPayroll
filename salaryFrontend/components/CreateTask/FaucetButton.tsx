/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-12 17:38:35
 * @Description:
 */
import { Button, Text } from "@chakra-ui/react";

import { useState, useMemo, useEffect } from "react";
import { utils, ethers } from "ethers";
import { useAccount } from "wagmi";

import { NETWORK, networkConfig } from "@/utils/config";

import ERC20ABI from "@/constants/ERC20ABI.json";
import { useRouter } from "next/router";

import { tokenList } from "@/utils/tokenList";
import { toast } from "react-toastify";

export default function FaucetButton() {
  const [isLoad, setIsLoad] = useState(false);

  const { address } = useAccount();

  const signer = () => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return signer;
    }
  };

  const erc20Token = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== "undefined") {
      const erc20Token = new ethers.Contract(
        tokenList[0].Address,
        ERC20ABI,
        currentSigner
      );
      return erc20Token;
    }
  }, [tokenList[0].Address]);
  console.log(tokenList[0].Address);

  const faucetHandler = async () => {
    setIsLoad(true);
    try {
      const tx = await erc20Token?.mint(address, utils.parseUnits("10000", 6));
      const receiptTx = await tx.wait(1);
      console.log(receiptTx);
      const balance = await erc20Token?.balanceOf(address);
      console.log(
        `${address} balance is ${utils.formatUnits(balance, 6)} USDT`
      );
      toast(`${address} balance is ${utils.formatUnits(balance, 6)} USDT`, {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (e) {
      console.log(e);
      toast("error " + e, {
        position: "top-center",
        autoClose: 5000,
      });
    }
    setIsLoad(false);
  };

  return (
    <Button
      isLoading={isLoad}
      loadingText="Submitting"
      colorScheme="teal"
      variant="solid"
      mt={8}
      onClick={faucetHandler}
    >
      USDT faucet
    </Button>
  );
}
