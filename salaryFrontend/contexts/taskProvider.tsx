import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from 'react';

export interface TaskCreateProviderValues {
  adminAddress: string;
  emailAddress: string;
  contractName: string;
  contractAddress:string,
  description?:string,
  receiver: string;
  buttonType: string;
  workType: string;
  tokenAddress: string;
  tokenNumber: number;
  tokenAmount: number;
  timeUnitValue: string;
  timeIntervalValue: number;
  roundValue: number;
  intervalSeconds: number;
  upkeeperContract: string;
  state: string;
  proposal?: string;
  proposalID?: string;
  endTime?: string;
  upKeepId?: string;
  image?: string;


  updateAdminAddress: (adminAddress: string) => void;
  updateEmailAddress: (emailAddress: string) => void;
  updateContractName: (contractName: string) => void;
  updateContractAddress:(contractAddress:string)=>void;
  updateDescription:(description:string)=>void;
  updateReceiver: (receiver: string) => void;
  updateButtonType: (buttonType: string) => void;
  updateWorkType: (workType: string) => void;
  updateTokenAddress: (tokenAddress: string) => void;
  updateTokenNumber: (tokenNumber: number) => void;
  updateTokenAmount: (tokenAmount: number) => void;
  updateTimeUnitValue: (timeUnitValue: string) => void;
  updateTimeIntervalValue: (timeIntervalValue: number) => void;
  updateRoundValue: (roundValue: number) => void;
  updateIntervalSeconds: (
    timeUnitValue: string,
    timeIntervalValue: number
  ) => void;
  updateupkeeperContract: (upkeeperContract: string) => void;
  updateState: (state: string) => void;
  updateProposal: (proposal: string) => void;
  updateProposalID: (proposalId: string) => void;
  updateEndTime: (endTime: string) => void;
  updateUpKeepId: (upKeepId: string) => void;
  updateImage: (image: string) => void;
}

const defaultValues = {
  adminAddress: '',
  emailAddress: '',
  contractName: '',
  contractAddress:'',
  description:'',
  receiver: '',
  buttonType: 'create',
  workType: '',
  tokenAddress: '',
  tokenNumber: 0,
  tokenAmount: 0,
  timeUnitValue: '',
  timeIntervalValue: 0,
  roundValue: 0,
  intervalSeconds: 0,
  upkeeperContract: '',
  state: '',
  proposal: '',
  proposalID: '',
  endTime: '',
  upKeepId:'',
  image:'',
  updateAdminAddress: () => null,
  updateEmailAddress: () => null,
  updateContractName: () => null,
  updateContractAddress:()=>null,
  updateDescription:()=>null,
  updateReceiver: () => null,
  updateButtonType: () => null,
  updateWorkType: () => null,
  updateTokenNumber: () => null,
  updateTokenAddress: () => null,
  updateTokenAmount: () => null,
  updateTimeUnitValue: () => null,
  updateTimeIntervalValue: () => null,
  updateRoundValue: () => null,
  updateIntervalSeconds: () => null,
  updateupkeeperContract: () => null,
  updateState: () => null,
  updateProposal: () => null,
  updateProposalID: () => null,
  updateEndTime: () => null,
  updateUpKeepId: () => null,
  updateImage: () => null,
};

const taskContext = createContext<TaskCreateProviderValues>(defaultValues);

export const useTaskContext = (): TaskCreateProviderValues =>
  useContext(taskContext);

export interface DefaultModeProps {}

interface taskContextProviderProps extends DefaultModeProps {
  children: ReactNode;
}
export const TaskContextProvider = ({
  children,
}: taskContextProviderProps): ReactElement => {
  const [adminAddress, setAdminAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [description, setDescription] = useState('');
  const [receiver, setReceiver] = useState('');
  const [buttonType, setButtonType] = useState('create');
  const [workType, setWorkType] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenNumber, setTokenNumber] = useState(0);

  const [tokenAmount, setTokenAmount] = useState(0);
  const [timeUnitValue, setTimeUnitValue] = useState('');
  const [timeIntervalValue, setTimeIntervalValue] = useState(0);
  const [roundValue, setRoundValue] = useState(0);
  const [intervalSeconds, setIntervalSeconds] = useState(0);
  const [upkeeperContract, setUpkeeperContract] = useState('');

  const [state, setState] = useState('');
  const [proposal, setProposal] = useState('');
  const [proposalID, setProposalID] = useState('');
  const [endTime, setEndTime] = useState('');
  const [upKeepId,setUpKeepId] = useState('');
  const [image,setImage] = useState('');


  const updateAdminAddress = (adminAddress: string) => {
    setAdminAddress(adminAddress);
  };
  const updateEmailAddress = (emailAddress: string) => {
    setEmailAddress(emailAddress);
  };
  const updateContractName = (contractName: string) => {
    setContractName(contractName);
  };
  const updateContractAddress=(contractAddress:string)=>{
    setContractAddress(contractAddress);
  };

  const updateDescription= (description:string)=>{
    setDescription(description)
  }
  const updateReceiver = (receiver: string) => {
    setReceiver(receiver);
  };
  const updateButtonType = (buttonType: string) => {
    setButtonType(buttonType);
  };
  const updateWorkType = (workType: string) => {
    setWorkType(workType);
  };
  const updateTokenAddress = (tokenAddress: string) => {
    setTokenAddress(tokenAddress);
  };

  const updateTokenNumber = (tokenNumber: number) => {
    setTokenNumber(tokenNumber);
  };
  const updateTokenAmount = (tokenAmount: number) => {
    setTokenAmount(tokenAmount);
  };
  const updateTimeUnitValue = (timeUnitValue: string) => {
    setTimeUnitValue(timeUnitValue);
  };
  const updateTimeIntervalValue = (timeIntervalValue: number) => {
    setTimeIntervalValue(timeIntervalValue);
  };
  const updateRoundValue = (roundValue: number) => {
    setRoundValue(roundValue);
  };
  const updateIntervalSeconds = (
    timeUnitValue: string,
    timeIntervalValue: number
  ) => {
    if (
      timeUnitValue === 'Month' &&
      timeIntervalValue !== undefined &&
      timeIntervalValue > 0
    ) {
      setIntervalSeconds(timeIntervalValue * 30 * 24 * 60 * 60);
    } else if (
      timeUnitValue === 'Day' &&
      timeIntervalValue !== undefined &&
      timeIntervalValue > 0
    ) {
      setIntervalSeconds(timeIntervalValue * 24 * 60 * 60);
    } else if (
      timeUnitValue === 'Hour' &&
      timeIntervalValue !== undefined &&
      timeIntervalValue > 0
    ) {
      setIntervalSeconds(timeIntervalValue * 60 * 60);
    } else if (
      timeUnitValue === 'Minute' &&
      timeIntervalValue !== undefined &&
      timeIntervalValue > 0
    ) {
      setIntervalSeconds(timeIntervalValue * 60);
    }
  };
  const updateupkeeperContract = (upkeeperContract: string) => {
    setUpkeeperContract(upkeeperContract);
  };

  const updateState = (state: string) => {
    setState(state);
  };
  const updateProposal = (proposal: string) => {
    setProposal(proposal);
  };
  const updateProposalID = (proposalID: string) => {
    setProposalID(proposalID);
  };
  const updateEndTime = (endTime: string) => {
    setEndTime(endTime);
  };
  const updateUpKeepId =  (upKeepId:string) => {
    setUpKeepId(upKeepId);
  }
  const updateImage =  (image:string) => {
    setImage(image);
  }

  return (
    <taskContext.Provider
      value={{
        adminAddress,
        emailAddress,
        contractName,
        contractAddress,
        description,
        receiver,
        buttonType,
        workType,
        tokenAddress,
        tokenNumber,
        tokenAmount,
        timeUnitValue,
        timeIntervalValue,
        roundValue,
        intervalSeconds,
        upkeeperContract,
        state,
        proposal,
        proposalID,
        endTime,
        upKeepId,
        image,
        updateAdminAddress,
        updateEmailAddress,
        updateContractName,
        updateContractAddress,
        updateDescription,
        updateReceiver,
        updateButtonType,
        updateWorkType,
        updateTokenAddress,
        updateTokenNumber,
        updateTokenAmount,
        updateTimeUnitValue,
        updateTimeIntervalValue,
        updateRoundValue,
        updateIntervalSeconds,
        updateupkeeperContract,
        updateState,
        updateProposal,
        updateProposalID,
        updateEndTime,
        updateUpKeepId,
        updateImage
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
