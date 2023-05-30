/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-29 18:03:44
 * @Description:
 */
import { Button, Text } from '@chakra-ui/react';

import { useState, useMemo, useEffect } from 'react';
import { utils, ethers } from 'ethers';
import { useAccount } from 'wagmi';
import smartPayrollFactoryAddress from '@/constants/smartPayrollFactoryAddress.json';
import smartPayrollFactoryABI from '@/constants/smartPayrollFactoryABI.json';
import { NETWORK } from '@/utils/config';
import KeeperAutoSelfRegisterAddress from '@/constants/KeeperAutoSelfRegisterAddress.json';
import smartPayrollByTimeABI from '@/constants/smartPayrollByTimeABI.json';
import ERC20ABI from '@/constants/ERC20ABI.json';
import { useRouter } from 'next/router';
import { useTaskContext } from '@/contexts/taskProvider';
import { tokenList } from '@/utils/tokenList';
import { Base64 } from 'js-base64';

import contractNFTABI from '@/constants/contractNFTABI.json';

// interface ContractButtonProps {
//   addressInput: string
//   onChangeState: (newState: boolean) => void
//   onChangeUpkeeperContractAddress: (address: string) => void
//   registrarParams: Array<any>
//   upContractParams: Array<string | number | undefined>
// }

export default function WriteButton() {
  const [isFirstLoad, setFirstIsLoad] = useState(false);

  const [trigger, setTrigger] = useState('');

  const { address } = useAccount();
  const [upkeeperContract, setUpkeeperContract] = useState('');
  const taskParams = useTaskContext();

  const upContractParams = [
    taskParams.intervalSeconds,
    taskParams.tokenAddress,
    address,
    taskParams.receiver,
    taskParams.roundValue,
  ];

  const signer = () => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return signer;
    }
  };

  const smartPayrollFactory = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const smartPayrollFactory = new ethers.Contract(
        smartPayrollFactoryAddress[NETWORK],
        smartPayrollFactoryABI,
        currentSigner
      );
      return smartPayrollFactory;
    }
  }, []);

  const erc20Token = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const erc20Token = new ethers.Contract(
        taskParams.tokenAddress!,
        ERC20ABI,
        currentSigner
      );
      return erc20Token;
    }
  }, [taskParams.tokenAddress]);

  const contractNFT = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const contractNFT = new ethers.Contract(
        taskParams.contractAddress,
        contractNFTABI,
        currentSigner
      );
      return contractNFT;
    }
  }, []);

  useEffect(() => {
    const getImageURI = async () => {
      const imageURI = await contractNFT?.tokenURI(0);
      try {
        const response = await fetch(imageURI);
        const imageSVG = await response.json();
        console.log(imageSVG.image);
        taskParams.updateImage(imageSVG.image);
      } catch (err) {
        console.log(err);
      }
    };
    getImageURI();
  }, []);

  // const smartPayrollByTime = useMemo(() => {
  //   const currentSigner = signer()
  //   if (typeof window !== "undefined") {
  //     const smartPayrollByTime = new ethers.Contract(upkeeperContract, smartPayrollByTimeABI, currentSigner)
  //     return smartPayrollByTime
  //   }
  // }, [upkeeperContract])

  useEffect(() => {
    if (trigger == 'trigger2') {
      const triggerTransfer = async () => {
        console.log(upkeeperContract);
        console.log(trigger);
        await transferToken();
      };
      triggerTransfer();
    }
  }, [trigger]);

  const transferToken = async () => {
    const currentSigner = signer();
    const transferAmount = ethers.utils.parseUnits(
      (taskParams.tokenAmount! * taskParams.roundValue!).toString(),
      tokenList[taskParams.tokenNumber!].Symbol
    );
    console.log(erc20Token);
    console.log(address);
    try {
      if (
        taskParams.tokenAddress == '0x0000000000000000000000000000000000000000'
      ) {
        const tx = {
          to: upkeeperContract,
          value: transferAmount,
        };
        const receiptTx = await currentSigner!.sendTransaction(tx);
        await receiptTx?.wait();
      } else {
        const balance = await erc20Token?.balanceOf(address);
        console.log('msg.sender:', balance);
        console.log(transferAmount);
        if (balance >= transferAmount) {
          const transferTx = await erc20Token?.transfer(
            upkeeperContract,
            transferAmount
          );

          await transferTx?.wait();
        }
      }
      setFirstIsLoad(false);
      taskParams.updateButtonType('upkeeper');
      setTrigger('');
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   if (uploadData == true) {

  //   fetchHandler(uploaData)
  // }}, [uploadData])

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
    setFirstIsLoad(true);
    try {
      const amount = ethers.utils.parseUnits(
        taskParams.tokenAmount!.toString(),
        tokenList[taskParams.tokenNumber!].Symbol
      );

      console.log(smartPayrollFactory);
      let tx = await smartPayrollFactory?.createUpkeepContract(
        upContractParams,
        amount
      );
      const receipt = await tx.wait(1);
      console.log(receipt.events[0]);
      const upKeeperContract = receipt.events[0].args[0];
      taskParams.updateupkeeperContract(upKeeperContract);
      setUpkeeperContract(upKeeperContract);
      console.log('upkeep contract', upkeeperContract);
      setTrigger('trigger2');
      console.log(trigger);
    } catch (err) {
      console.log('create contract factory error:' + err);
    }
  };

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
      {isFirstLoad ? (
        <Text>The interaction with MetaMask has not yet ended</Text>
      ) : (
        ''
      )}
      

      <Button
        isLoading={isFirstLoad}
        loadingText='Submitting'
        colorScheme='teal'
        variant='solid'
        onClick={createUpkeepContractHandle}
      >
        Depoist token to contract
      </Button>
    </>
  );
}
