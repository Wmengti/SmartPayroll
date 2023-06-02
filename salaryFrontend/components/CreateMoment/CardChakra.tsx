/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-01 17:49:51
 * @Description:
 */
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  useDisclosure,
  FormLabel,
  Input,
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import React, { useMemo, useState,useEffect } from 'react';
import { useTaskContext } from '@/contexts/taskProvider';
import { useAccount } from 'wagmi';
import { createAuto } from '@/interact/createAuto';
import { create } from '@/interact/create';
import { ethers,utils } from 'ethers';
import smartPayrollByTimeABI from '@/constants/smartPayrollByTimeABI.json';
import { networkConfig, NETWORK } from '@/utils/config';
import automationRegistryABI from '@/constants/automationRegistryABI.json';
import smartPayrollFactoryAddress from '@/constants/smartPayrollFactoryAddress.json';
import ERC20ABI from '@/constants/ERC20ABI.json';
import { tokenDic,tokenSymbol } from '@/utils/tokenList';

const CardChakra = (props: any) => {
  const taskParams = useTaskContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const [isToggle, setIsToggle] = useState(true);
  const [contractBalance,setContractBalance]=useState();
  const [vaultBalance,setVaultBalance]=useState();


  console.log(props);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const signer = () => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return signer;
    }
  };
  const smartPayrollBytime = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const smartPayrollBytime = new ethers.Contract(
        props.contract.upkeeperContract,
        smartPayrollByTimeABI,
        currentSigner
      );
      return smartPayrollBytime;
    }
  }, []);

  const registry = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const registry = new ethers.Contract(
        networkConfig[NETWORK].automationRegistry,
        automationRegistryABI,
        currentSigner
      );
      return registry;
    }
  }, []);
  
  const erc20Token = useMemo(() => {
    const currentSigner = signer();
    if (typeof window !== 'undefined') {
      const erc20Token = new ethers.Contract(
        tokenDic[props.contract.token],
        ERC20ABI,
        currentSigner
      );
      return erc20Token;
    }
  }, []);

  useEffect(()=>{
    console.log(props.contract.contractAddress)
    console.log(props.contract.DAOAddress)
    console.log(erc20Token)
    
    const balanceHandler = async ()=>{
      let contractBalance = await erc20Token?.balanceOf(props.contract.contractAddress);
      contractBalance =parseInt(utils.formatUnits(contractBalance,tokenSymbol[props.contract.token]))
      console.log('contractBalance:',contractBalance);
      setContractBalance(contractBalance)
      let vaultBalance = await erc20Token?.balanceOf(props.contract.DAOAddress);
      vaultBalance = parseInt(utils.formatUnits(vaultBalance,tokenSymbol[props.contract.token]))
      console.log('vaultBalance:', vaultBalance);
      setVaultBalance(vaultBalance)
    }
    balanceHandler()

  },[])

  const uploadData = {
    contractAddress: props.contract.contractAddress,
    state: taskParams.state,
    proposal: taskParams.proposal,
    proposalID: taskParams.proposalID,
    endTime: taskParams.endTime,
  };
  const fetchHandler = async (uploaData: any) => {
    console.log(uploaData);
    const response = await fetch('/api/updateDB', {
      method: 'POST',
      body: JSON.stringify(uploaData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = await response.json();

    console.log(res);
  };
  const saveHandler = async () => {
    taskParams.updateState('cancel');
    await fetchHandler(uploadData);
    onClose();
    try {
      // const balance = await smartPayrollBytime!.getTokenBalance(props.contract.upkeeperContract,'0x81A9205F956A1D6ae81f51977Da9702A023e199a')

      // console.log("balance=========",balance);
      const desTx = await smartPayrollBytime!.contractDestruct();
      const receiptTx = await desTx.wait(1);
      console.log(receiptTx);
      console.log(props.contract.upKeepId);
      const Tx = await registry!.cancelUpkeep(props.contract.upKeepId);
      const receipt = await Tx.wait(1);
      console.log(receipt);
    } catch (err) {
      console.log(err);
    }
    console.log(props.contract.DAOAddress);

    const createParams = {
      DAOAddress: props.contract.DAOAddress,
      FactoryAddress: smartPayrollFactoryAddress[NETWORK],
      endTime: props.contract.endTime,
      proposalID: props.contract.proposalID,
    };

    // await create(createParams);
    await createAuto(createParams);

    console.log('done');
  };

  const proposalHandler = (e: any) => {
    console.log(e.target.value);
    const proposal = e.target.value.toString();
    taskParams.updateProposal(proposal);

    const proposalArray = proposal.split('/');
    taskParams.updateProposalID(proposalArray[proposalArray.length - 1]);
    console.log('ProposalID', proposalArray[proposalArray.length - 1]);
  };
  const endTimeHandler = (e: any) => {
    const dateString = e.target.value.toString();
    const timestamp = new Date(dateString).getTime();
    console.log(dateString);
    console.log(timestamp / 1000);

    taskParams.updateEndTime(dateString);
  };

  const detailsHandler = () => {
    setIsToggle(false);
    onOpen();
  };

  const termHandler = () => {
    setIsToggle(true);
    onOpen();
  };

  return (
    <>
      <Card maxW='sm' bg='gray.100'>
        <CardBody>
          <Image
            width='60'
            height='40'
            src={props.contract.image}
            alt='contract NFT'
            borderRadius='lg'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md'>{props.contract.contractName}</Heading>
            <Text>Desposit {props.contract.amount*props.contract.round} {props.contract.token}</Text>
            <Text>Balance {contractBalance} {props.contract.token}</Text>
            <Text>Lock {vaultBalance} {props.contract.token}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing='2'>
            {props.contract.receiver != address && (
              <Button
                // isDisabled={props.contract.state=='cancel'}
                variant='solid'
                colorScheme='blue'
                onClick={termHandler}
              >
                Terminate
              </Button>
            )}
            <Button variant='ghost' colorScheme='blue' onClick={detailsHandler}>
              go to detail
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        {isToggle ? (
          <ModalContent>
            <ModalHeader>Click the link to create a vote</ModalHeader>
            <Link href='https://demo.snapshot.org/#/0x3c.eth' isExternal mx={6}>
              Snapshot.org
              <ExternalLinkIcon mx='2px' />
            </Link>
            <Link></Link>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Proposal share</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder='snapshot proposal link'
                  onChange={proposalHandler}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>End time</FormLabel>
                <Input
                  placeholder='Select Date and Time'
                  size='md'
                  type='datetime-local'
                  onChange={endTimeHandler}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={saveHandler}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent >
            <ModalHeader>Contract details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack spacing={2} px={4}>
              <Text fontSize='lg' as='b' >Contract Name</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.contractName}</Text>
              <Text fontSize='lg' as='b' >Employer Address</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.admin}</Text>
              <Text fontSize='lg' as='b' >Employee Address</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.receiver}</Text>
              <Text fontSize='lg' as='b' >Work Type</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.workType}</Text>
              <Text fontSize='lg' as='b' >Salary</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.amount} {props.contract.token}</Text>
              <Text fontSize='lg' as='b' >Sending Cycle</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.timeInterval} {props.contract.timeUint}</Text>
              <Text fontSize='lg' as='b' >Sending Round</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.round}</Text>
              <Text fontSize='lg' as='b' >Contract State</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.state || "active"}</Text>
              {/* <Text fontSize='lg' as='b' >Vault Balance</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.state}</Text> */}
              {/* <Text fontSize='lg' as='b' >Contract Balance</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.state}</Text>
              <Text fontSize='lg' as='b' >Contract Deposit</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.state}</Text> */}
              {/* {props.contract.description!='' &&<Text fontSize='lg' as='b' >Contract Description</Text>}
              {props.contract.description!='' &&<Text fontSize='lg' bg='gray.100'>{props.contract.description}</Text>} */}
              
              {/* <Text fontSize='lg' as='b' >Contract Photo</Text>
              <Text fontSize='lg' bg='gray.100'>{props.contract.state}</Text> */}
              
              </Stack>
              
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default CardChakra;
