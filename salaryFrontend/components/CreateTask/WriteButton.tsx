/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-06 13:50:23
 * @Description:
 */
import { Button, Text } from '@chakra-ui/react';

import { useState, useMemo, useEffect } from 'react';
import { utils, ethers } from 'ethers';
import { useAccount } from 'wagmi';
import smartPayrollFactoryAddress from '@/constants/smartPayrollFactoryAddress.json';
import smartPayrollFactoryABI from '@/constants/smartPayrollFactoryABI.json';
import { NETWORK,networkConfig } from '@/utils/config';
import KeeperAutoSelfRegisterAddress from '@/constants/keeperAutoSelfRegisterAddress.json';
import smartPayrollByTimeABI from '@/constants/smartPayrollByTimeABI.json';
import ERC20ABI from '@/constants/ERC20ABI.json';
import { useRouter } from 'next/router';
import { useTaskContext } from '@/contexts/taskProvider';
import { tokenList } from '@/utils/tokenList';
import { Base64 } from 'js-base64';
import creditTokenAddress from '@/constants/creditTokenAddress.json';

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

  const amount = ethers.utils.parseUnits(
    taskParams.tokenAmount?.toString()||"0",
    tokenList[0].Symbol
  );
  const upContractParams = [
    taskParams.intervalSeconds,
    taskParams.tokenAddress,
    address,
    taskParams.receiver,
    taskParams.roundValue,
    amount,
    creditTokenAddress[NETWORK],
    networkConfig[NETWORK].automationRegistry
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
      tokenList[0].Symbol
    );
    console.log(transferAmount);
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
      console.log('send done!')
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
      console.log(upContractParams);
      console.log(creditTokenAddress[NETWORK]);
      console.log(smartPayrollFactory);
      let tx = await smartPayrollFactory?.createUpkeepContract(
        upContractParams
      );
      const receipt = await tx.wait(1);
      console.log(receipt);
      const DAOAddress = receipt.events[1].args[0];
      const upKeeperContract = receipt.events[2].args[0];
      taskParams.updateDAOAddress(DAOAddress);
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
