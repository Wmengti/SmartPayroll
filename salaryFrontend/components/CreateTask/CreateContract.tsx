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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";

import CreateButton from "@/components/CreateTask/CreateButton";
import { useTaskContext } from "@/contexts/taskProvider";
import { v4 as uuidv4 } from "uuid";

import { useAccount } from "wagmi";
/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-20 11:21:32
 * @Description:
 */

export default function CreateContract() {
  const taskParams = useTaskContext();
  const [EmailIsError, setEmailIsError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const { address } = useAccount();

  const emailInputHandler = (e: any) => {
    const reEmail =
      /^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i;
    taskParams.updateEmailAddress(e.target.value);
    if (e.target.value && reEmail.test(e.target.value)) {
      setEmailIsError(false);
    } else {
      setEmailIsError(true);
    }
  };

  const contractSubmitHander = (e: any) => {
    e.preventDefault();
    //aws data
  };
  const addressInputHandler = (e: any) => {
    taskParams.updateReceiver(e.target.value);
    if (e.target.value.length == 42) {
      setAddressError(false);
    } else {
      setAddressError(true);
    }
  };

  const nameInputHandler = (e: any) => {
    if (e.target.value == "") {
      setNameError(true);
    } else {
      setNameError(false);
    }

    taskParams.updateContractName(e.target.value);
  };
  const workHandler = (e: any) => {
    taskParams.updateWorkType(e);
    console.log(e);
  };

  const decriptionHandler = (e: any) => {
    taskParams.updateDescription(e.target.value);
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleImageSelectButtonClick = () => {
    hiddenFileInput.current?.click();
  };

  useEffect(() => {
    if (EmailIsError || addressError || nameError) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [EmailIsError, addressError, nameError]);

  // const  uploadImageToS3 = async (file: File, dir: string)=>{
  //     const fileType = encodeURIComponent(file.type)
  //     const targetFilePath = `${dir}/${uuidv4()}`

  //     const res = await fetch(
  //         `/api/image-upload?file=${targetFilePath}&fileType=${fileType}`
  //     )
  //     const {url, fields} = await res.json()
  //     const formData = new FormData()
  //     Object.entries({...fields, file}).forEach(([key, value]) => {
  //         formData.append(key, value as string)
  //     })

  //     const upload = await fetch(url, {
  //         method: 'POST',
  //         body: formData,
  //     })

  //     if (upload && upload.ok) {
  //         console.log('Upload success')
  //         return targetFilePath
  //     } else {
  //         console.log('Upload failed')
  //         return ''
  //     }
  // }
  //   const updateImage = async (name: string, image: File) => {

  //     const path = await uploadImageToS3(image, name);

  //   };
  //   const imageChangeHandler = async (e:any) => {
  //     let image = e.target.files[0];
  //     if (!image) {
  //       console.log('There is no image');
  //       return;
  //     }
  //     await updateImage(image.name, image);
  //   };

  return (
    <>
      <Text fontSize="xl" mb="8">
        Establish your partnership by creating a payroll contract
      </Text>
      <Box
        bg="gray.200"
        maxW="2xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="10"
      >
        <form className="flex flex-col gap-5" onSubmit={contractSubmitHander}>
          <FormControl isRequired isInvalid={nameError}>
            <FormLabel>Contract Name</FormLabel>
            <Input
              type="name"
              bg="white"
              placeholder="Solidity developer"
              onChange={nameInputHandler}
              value={taskParams.contractName}
            />
            {nameError ? (
              <FormErrorMessage>
                Please provide a concise and meaningful suggestion for the
                contract name
              </FormErrorMessage>
            ) : (
              <FormHelperText></FormHelperText>
            )}
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
            {EmailIsError ? (
              <FormErrorMessage>email is wrong.</FormErrorMessage>
            ) : (
              <FormHelperText></FormHelperText>
            )}
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
            <RadioGroup
              defaultValue="fulltime"
              value={taskParams.workType}
              onChange={workHandler}
            >
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
            <Textarea
              placeholder="Here is a sample placeholder"
              bg="white"
              onChange={decriptionHandler}
              value={taskParams.description}
            />
          </FormControl>
          <ButtonGroup size="sm" isAttached variant="outline">
            <label htmlFor="file-upload" className="upload-button">
              <Button bg="gray.300" onClick={handleImageSelectButtonClick}>
                Upload Contract Content by Taking a Photo(Optional)
              </Button>

              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                ref={hiddenFileInput}
                // onChange={imageChangeHandler}
              />
            </label>
            <IconButton
              bg="white"
              aria-label="file-upload"
              icon={<AddIcon />}
              onClick={handleImageSelectButtonClick}
            />
          </ButtonGroup>

          <CreateButton isDisabled={isDisabled} />
        </form>
      </Box>
    </>
  );
}
