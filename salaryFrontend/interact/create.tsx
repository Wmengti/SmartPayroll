/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-26 14:58:33
 * @Description: 
 */
import { utils,ethers } from "ethers"
import {networkConfig,NETWORK} from "@/utils/config"
import functionsBillingRegistryProxyABI from "@/constants/FunctionsBillingRegistryABI.json"
import functionsOracleProxyABI from "@/constants/functionsOracleProxyABI.json"
import linkTokenABI from "@/constants/linkTokenABI.json"
import functionAutoConsumerABI from "@/constants/functionAutoConsumerABI.json"
import {configProvider} from '@/utils/config';
import  getRequestConfig from '@/contracts/Functions-request-config';
import smartPayrollFactoryAddress from "@/constants/smartPayrollFactoryAddress.json"
import smartPayrollFactoryABI from "@/constants/smartPayrollFactoryABI.json"
import KeeperAutoSelfRegisterAddress from "@/constants/KeeperAutoSelfRegisterAddress.json"
import functionsFactoryABI from "@/constants/functionsFactoryABI.json"
import functionsFatoryAddress from "@/constants/functionsFactoryAddress.json"

import {
  // simulateRequest,
  buildRequest,
  // getDecodedResultLog,
} from "@/FunctionsSandboxLibrary"

interface RequestConfig {
  codeLocation: number;
  codeLanguage: number;
  source: string;
  secrets: {};
  perNodeSecrets: never[];
  walletPrivateKey: string | undefined;
  args: any[];
  expectedReturnType: string;
  secretsURLs: never[];
  globalOffchainSecrets: {};
  perNodeOffchainSecrets: never[];
}
interface ExtendedRequestConfig extends RequestConfig {
  DONPublicKey?: string;
}

interface requestType {
    source:any,
    secrets?:any[],
    args?:any[] 
}

export const create = async ()=>{

  const signer= configProvider().getSigner();
  // contract factory
  const registryFactory = new ethers.Contract(
    networkConfig[NETWORK].functionsBillingRegistryProxy,
    functionsBillingRegistryProxyABI,
    signer
  )
  
  const oracle = new ethers.Contract(
    networkConfig[NETWORK].functionsOracleProxy,
    functionsOracleProxyABI,
    signer
  )

  const linkToken = new ethers.Contract(
    networkConfig[NETWORK].linkToken,
    linkTokenABI,
    signer
  )

  const functionFactory = new ethers.Contract(
    functionsFatoryAddress[NETWORK],
    functionsFactoryABI,
    signer
  )
  // isAuthorized because the test is not opened for all addresses
  const isWalletAllowed = await oracle.isAuthorizedSender(signer.address)

  if (!isWalletAllowed)
    return console.log(
      "\nChainlink Functions is currently in a closed testing phase.\nFor access sign up here:\nhttps://functions.chain.link"
    )
  console.log("Creating Functions billing subscription")
  const createSubscriptionTx = await registryFactory.createSubscription()
  const createSubscriptionReceipt = await createSubscriptionTx.wait(2)
  const subscriptionId = createSubscriptionReceipt.events[0].args["subscriptionId"].toNumber()
  console.log(`Subscription created with ID: ${subscriptionId}`)
  // check address for LINK balance
  const linkBalance = await linkToken.balanceOf(signer.address)
  console.log(linkBalance)
  const juelsAmount = ethers.utils.parseUnits('0.1')
  if (juelsAmount.gt(linkBalance)) {
    throw Error(
      `Insufficent LINK balance. Trying to fund subscription with ${ethers.utils.formatEther(
        juelsAmount
      )} LINK, but only have ${ethers.utils.formatEther(linkBalance)}.`
    )
  }
  const fundTx = await linkToken.transferAndCall(
    networkConfig[NETWORK].functionsBillingRegistryProxy,
    juelsAmount,
    ethers.utils.defaultAbiCoder.encode(["uint64"], [subscriptionId])
  )
  await fundTx.wait(2);
  console.log(`Subscription ${subscriptionId} funded with ${ethers.utils.formatEther(juelsAmount)} LINK`)
  
  //deply functionFactory automation consumer
  console.log('create automation functions')
  const deployTx = await functionFactory.createAutomatedFunctions(
    networkConfig[NETWORK].functionsOracleProxy,
    subscriptionId,
    200000,
    60
  )


  console.log(`\nWaiting 1 block for transaction ${deployTx.hash} to be confirmed...`)
  const deployReceipt = await deployTx.wait(2)
  console.log(deployReceipt.events[0])
  console.log(deployReceipt.events[0].args[0])
  const functinConsumerAddress = deployReceipt.events[0].args[0]
  //add request to FunctionConsumer 
  const functinConsumer = new ethers.Contract(
    functinConsumerAddress,
    functionAutoConsumerABI,
    signer
  )
  
  const requestConfig:ExtendedRequestConfig = getRequestConfig('JP');
  console.log(requestConfig)
  const DONPublicKey = await oracle.getDONPublicKey();
  // Remove the preceding 0x from the DON public key
  requestConfig.DONPublicKey = DONPublicKey.slice(2);
  // Build the parameters to make a request from the client contract
  const request:requestType = await buildRequest(requestConfig);
  console.log(request)
 
  // functinConsumer
  console.log('start generate request')
  const functionsRequestBytes = await functinConsumer.generateRequest(
    request.source,
    request.secrets ?? [],
    request.args ?? ['JP']
  )
  console.log("Setting Functions request")
  const setRequestTx = await functinConsumer.setRequest(
    subscriptionId,
    200000,
    300,
    functionsRequestBytes
  )
  await setRequestTx.wait(2)

  console.log(setRequestTx)
  const registrarParams = [
    "testFunctions",
    utils.formatBytes32String(""),
    functinConsumerAddress,
    "700000",
    '0xb1BfB47518E59Ad7568F3b6b0a71733A41fC99ad',
    utils.formatBytes32String(""),
    utils.formatBytes32String(""),
    utils.parseUnits("0.5", 18),
  ]
  const smartPayrollFactory = new ethers.Contract(
    smartPayrollFactoryAddress[NETWORK],
    smartPayrollFactoryABI,
    signer
  )
  let tx = await smartPayrollFactory?.createKeeper(KeeperAutoSelfRegisterAddress[NETWORK], registrarParams)

  const receipt = await tx.wait(1)

  const upKeepId = receipt.events[0]
  console.log("upkeep", upKeepId)

}