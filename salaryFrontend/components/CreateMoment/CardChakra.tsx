/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-31 09:56:59
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
import React from 'react';
import { useTaskContext } from '@/contexts/taskProvider';
import { useAccount } from 'wagmi';
import { createAuto } from '@/interact/createAuto';

const CardChakra = (props: any) => {
  const taskParams = useTaskContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {address} = useAccount();
  console.log(props);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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
    await createAuto();
    console.log("done")

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
    console.log(e.target.value);
    taskParams.updateEndTime(e.target.value);
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
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing='2'>
            {props.contract.receiver !=address && <Button isDisabled={props.contract.state=='cancel'} variant='solid' colorScheme='blue' onClick={onOpen}>
              Terminate
            </Button>}
            <Button variant='ghost' colorScheme='blue'>
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
      </Modal>
    </>
  );
};

export default CardChakra;
