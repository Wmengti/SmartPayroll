/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 15:21:44
 * @Description: 
 */
import { ethers } from "ethers"
import {networkConfig,NETWORK,functionFactoryABI} from "@/utils/config"
import functionsBillingRegistryProxyABI from "@/constants/FunctionsBillingRegistryABI.json"
import functionsOracleProxyABI from "@/constants/functionsOracleProxyABI.json"
import linkTokenABI from "@/constants/linkTokenABI.json"
import functionAutoConsumerABI from "@/constants/functionAutoConsumerABI.json"
import {configProvider} from '@/utils/config';
import  getRequestConfig from '@/contracts/Functions-request-config';

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
    networkConfig[NETWORK].functionFactory,
    functionFactoryABI,
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
  const juelsAmount = ethers.utils.parseUnits('1')
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
  const deployTx = await functionFactory.createAutomatedFunctions(
    networkConfig[NETWORK].functionsOracleProxy,
    subscriptionId,
    200000,
    300
  )

  console.log(`\nWaiting 1 block for transaction ${deployTx.hash} to be confirmed...`)
  const deployReceipt = await deployTx.wait(2)
  console.log(deployReceipt.events[0].args[0])
  const functinConsumerAddress = deployReceipt.events[0].args[0]
  //add request to FunctionConsumer 
  const functinConsumer = new ethers.Contract(
    functinConsumerAddress,
    functionAutoConsumerABI,
    signer
  )
  
  const requestConfig = getRequestConfig('0xab619164329aea8c44dcf8ca3dab3cfc5a31afa7450eb151210d6a651a1a5e18');
  const request = await generateRequest(requestConfig, taskArgs)
  const functionsRequestBytes = await functinConsumer.generateRequest(
    request.source,
    request.secrets ?? [],
    request.args ?? []
  )
  
  functinConsumer

}