import { createContext, ReactElement, ReactNode, useContext, useState } from "react"


export interface TaskCreateProviderValues {
  adminAddress?: string
  emailAddress?: string
  contractName?: string
  receiver?: string
  haveContract?: boolean
  workType?: string
  tokenAddress?: string
  tokenNumber?:number
  tokenAmount?: number
  timeUnitValue?: string
  timeIntervalValue?: number
  roundValue?: number
  intervalSeconds?: number
  upkeeperContract?: string

  updateAdminAddress: (adminAddress: string) => void
  updateEmailAddress: (emailAddress: string) => void
  updateContractName: (contractName: string) => void
  updateReceiver: (receiver: string) => void
  updateHaveContract: (haveContract: boolean) => void
  updateWorkType: (workType: string) => void
  updateTokenAddress: (tokenAddress: string) => void
  updateTokenNumber: (tokenNumber: number) => void
  updateTokenAmount: (tokenAmount: number) => void
  updateTimeUnitValue: (timeUnitValue: string) => void
  updateTimeIntervalValue: (timeIntervalValue: number) => void
  updateRoundValue: (roundValue: number) => void
  updateIntervalSeconds: (timeUnitValue:string,timeIntervalValue:number) => void
  updateupkeeperContract: (upkeeperContract: string) => void
}

const defaultValues = {
  adminAddress: "",
  emailAddress: "",
  contractName: "",
  receiver: "",
  haveContract: false,
  workType: "",
  tokenAddress: "",
  tokenNumber: 0,
  tokenAmount: 0,
  timeUnitValue: "",
  timeIntervalValue: 0,
  roundValue: 0,
  intervalSeconds: 0,
  upkeeperContract: "",
  updateAdminAddress: () => null,
  updateEmailAddress: () => null,
  updateContractName: () => null,
  updateReceiver: () => null,
  updateHaveContract: () => null,
  updateWorkType: () => null,
  updateTokenNumber: () => null,
  updateTokenAddress: () => null,
  updateTokenAmount: () => null,
  updateTimeUnitValue: () => null,
  updateTimeIntervalValue: () => null,
  updateRoundValue: () => null,
  updateIntervalSeconds: () => null,
  updateupkeeperContract: () => null,
}

const taskContext = createContext<TaskCreateProviderValues>(defaultValues)

export const useTaskContext = (): TaskCreateProviderValues =>useContext(taskContext);

export interface DefaultModeProps {}

interface taskContextProviderProps extends DefaultModeProps {
  children: ReactNode
}
export const TaskContextProvider = ({ children }: taskContextProviderProps): ReactElement => {
  const [adminAddress,setAdminAddress] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [contractName, setContractName] = useState('')
  const [receiver, setReceiver] = useState('')
  const [haveContract, setHaveContract] = useState(false)
  const [workType, setWorkType] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenNumber, setTokenNumber] = useState(0)

  const [tokenAmount, setTokenAmount] = useState(0)
  const [timeUnitValue, setTimeUnitValue] = useState('')
  const [timeIntervalValue, setTimeIntervalValue] = useState(0)
  const [roundValue, setRoundValue] = useState(0)
  const [intervalSeconds, setIntervalSeconds] = useState(0)
  const [upkeeperContract,setUpkeeperContract] = useState('')

  const updateAdminAddress = (adminAddress:string) => {
    
    setAdminAddress(adminAddress);
  }
  const updateEmailAddress= (emailAddress: string) => {
    setEmailAddress(emailAddress);
  }
  const updateContractName= (contractName: string) => {
    setContractName(contractName);
  }
  const updateReceiver= (receiver: string) => {
    setReceiver(receiver);
  }
  const updateHaveContract=(haveContract: boolean) => {
    setHaveContract(haveContract);
  }
  const updateWorkType=(workType: string) => {
    setWorkType(workType);
  }
  const updateTokenAddress= (tokenAddress: string) => {
    setTokenAddress(tokenAddress);
  }

  const updateTokenNumber = (tokenNumber: number) => {
    setTokenNumber(tokenNumber);
  }
  const updateTokenAmount= (tokenAmount: number) => {
    setTokenAmount(tokenAmount);
  }
  const updateTimeUnitValue= (timeUnitValue: string) => {
    setTimeUnitValue(timeUnitValue);
  }
  const updateTimeIntervalValue= (timeIntervalValue: number) => {
    setTimeIntervalValue(timeIntervalValue);
  }
  const updateRoundValue= (roundValue: number) => {
    setRoundValue(roundValue);
  }
  const updateIntervalSeconds= (timeUnitValue:string,timeIntervalValue:number) => {
    if (timeUnitValue === "Month" && timeIntervalValue !== undefined && timeIntervalValue > 0) {
      setIntervalSeconds(timeIntervalValue * 30 * 24 * 60 * 60)
    } else if (timeUnitValue === "Day" && timeIntervalValue !== undefined && timeIntervalValue > 0) {
      setIntervalSeconds(timeIntervalValue * 24 * 60 * 60)
    } else if (timeUnitValue === "Hour" && timeIntervalValue !== undefined && timeIntervalValue > 0) {
      setIntervalSeconds(timeIntervalValue * 60 * 60)
    } else if (timeUnitValue === "Minute" && timeIntervalValue !== undefined && timeIntervalValue > 0) {
      setIntervalSeconds(timeIntervalValue * 60)
    }

  }
  const updateupkeeperContract=(upkeeperContract: string) => {
    setUpkeeperContract(upkeeperContract);
  }
  

  return (
    <taskContext.Provider
      value={{
        adminAddress,
        emailAddress,
        contractName,
        receiver,
        haveContract,
        workType,
        tokenAddress,
        tokenNumber,
        tokenAmount,
        timeUnitValue,
        timeIntervalValue,
        roundValue,
        intervalSeconds,
        upkeeperContract,
        updateAdminAddress,
        updateEmailAddress,
        updateContractName,
        updateReceiver,
        updateHaveContract,
        updateWorkType,
        updateTokenAddress,
        updateTokenNumber,
        updateTokenAmount,
        updateTimeUnitValue,
        updateTimeIntervalValue,
        updateRoundValue,
        updateIntervalSeconds,
        updateupkeeperContract,
      }}
    >
      {children}
    </taskContext.Provider>
  )
}
