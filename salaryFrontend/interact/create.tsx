/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-06 16:20:00
 * @Description:
 */
import { utils, ethers } from "ethers";
import {
  networkConfig,
  NETWORK,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "@/utils/config";
import functionsBillingRegistryProxyABI from "@/constants/FunctionsBillingRegistryABI.json";
import functionsOracleProxyABI from "@/constants/functionsOracleProxyABI.json";
import linkTokenABI from "@/constants/linktokenABI.json";

import functionAutoConsumerABI from "@/constants/functionAutoConsumerABI.json";
import { configProvider } from "@/utils/config";
import getRequestConfig from "@/contracts/Functions-request-config";
import smartPayrollFactoryAddress from "@/constants/smartPayrollFactoryAddress.json";
import smartPayrollFactoryABI from "@/constants/smartPayrollFactoryABI.json";
import KeeperAutoSelfRegisterAddress from "@/constants/keeperAutoSelfRegisterAddress.json";
import functionsFactoryABI from "@/constants/functionsFactoryABI.json";
import functionsFatoryAddress from "@/constants/functionsFactoryAddress.json";
import { toast } from "react-toastify";

import {
  buildRequest,
  // getDecodedResultLog,
} from "@/FunctionsSandboxLibrary";
import { simulateRequest } from "@/FunctionsSandboxLibrary/simulateRequest";
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
  source: any;
  secrets?: any[];
  args?: any[];
}
interface ParamsConfigType {
  DAOAddress: string;
  factoryAddress: string;
  endTime: number;
  proposalID: string;
  contractName: string;
  address: `0x${string}` | undefined;
}
export const create = async (Params: ParamsConfigType) => {
  const signer = configProvider().getSigner();
  const provider = configProvider().getProvider();
  // contract factory
  const registryFactory = new ethers.Contract(
    networkConfig[NETWORK].functionsBillingRegistryProxy,
    functionsBillingRegistryProxyABI,
    signer
  );

  const oracle = new ethers.Contract(
    networkConfig[NETWORK].functionsOracleProxy,
    functionsOracleProxyABI,
    signer
  );

  const linkToken = new ethers.Contract(
    networkConfig[NETWORK].linkToken,
    linkTokenABI,
    signer
  );

  const functionFactory = new ethers.Contract(
    functionsFatoryAddress[NETWORK],
    functionsFactoryABI,
    signer
  );
  // isAuthorized because the test is not opened for all addresses
  const isWalletAllowed = await oracle.isAuthorizedSender(signer.address);

  if (!isWalletAllowed)
    return console.log(
      "\nChainlink Functions is currently in a closed testing phase.\nFor access sign up here:\nhttps://functions.chain.link"
    );
  console.log("Creating Functions billing subscription");
  const createSubscriptionTx = await registryFactory.createSubscription();
  const createSubscriptionReceipt = await createSubscriptionTx.wait(2);
  const subscriptionId =
    createSubscriptionReceipt.events[0].args["subscriptionId"].toNumber();
  console.log(`Subscription created with ID: ${subscriptionId}`);
  // check address for LINK balance
  const linkBalance = await linkToken.balanceOf(signer.address);
  console.log(linkBalance);
  const juelsAmount = ethers.utils.parseUnits("0.5");
  if (juelsAmount.gt(linkBalance)) {
    throw Error(
      `Insufficent LINK balance. Trying to fund subscription with ${ethers.utils.formatEther(
        juelsAmount
      )} LINK, but only have ${ethers.utils.formatEther(linkBalance)}.`
    );
  }
  const fundTx = await linkToken.transferAndCall(
    networkConfig[NETWORK].functionsBillingRegistryProxy,
    juelsAmount,
    ethers.utils.defaultAbiCoder.encode(["uint64"], [subscriptionId])
  );
  await fundTx.wait(2);
  console.log(
    `Subscription ${subscriptionId} funded with ${ethers.utils.formatEther(
      juelsAmount
    )} LINK`
  );

  //deply functionFactory automation consumer
  console.log("create automation functions");

  const deployTx = await functionFactory.createAutomatedFunctions(
    networkConfig[NETWORK].functionsOracleProxy,
    subscriptionId,
    200000,
    Params.endTime,
    Params.DAOAddress,
    Params.factoryAddress
  );
  // const deployTx = await functionFactory.createAutomatedFunctionsConsumer(
  //   networkConfig[NETWORK].functionsOracleProxy,
  //   subscriptionId,
  //   200000,
  //   60
  // )

  console.log(
    `\nWaiting 1 block for transaction ${deployTx.hash} to be confirmed...`
  );
  const deployReceipt = await deployTx.wait(2);
  console.log(deployReceipt.events[0]);
  console.log(deployReceipt.events[0].args[0]);
  const functinConsumerAddress = deployReceipt.events[0].args[0];

  //addconsumer to subscriotion id
  const addTx = await registryFactory.addConsumer(
    subscriptionId,
    functinConsumerAddress
  );
  console.log(`Waiting  for transaction ${addTx.hash} to be confirmed...`);
  await addTx.wait(2);
  ////////////////////////////////////////////////////////////////
  //add request to FunctionConsumer
  const functinConsumer = new ethers.Contract(
    functinConsumerAddress,
    functionAutoConsumerABI,
    signer
  );
  if (Params.proposalID == "") {
    toast("proposalID is null", {
      position: "top-center",
      autoClose: 5000,
    });
    throw Error("proposalID is not exist");
  } else {
    toast(`proposalID is ${Params.proposalID}`, {
      position: "top-center",
      autoClose: 5000,
    });
  }

  const requestConfig: ExtendedRequestConfig = getRequestConfig([
    Params.proposalID,
  ]);
  console.log(requestConfig);
  const DONPublicKey = await oracle.getDONPublicKey();
  // Remove the preceding 0x from the DON public key
  requestConfig.DONPublicKey = DONPublicKey.slice(2);
  // Build the parameters to make a request from the client contract
  const request: requestType = await buildRequest(requestConfig);
  console.log(request);

  // const { lastBaseFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData()
  //   const estimatedCostJuels = await functinConsumer.estimateCost(
  //     [
  //       0, // Inline
  //       0, // Inline
  //       0, // JavaScript
  //       request.source,
  //       request.secrets ?? [],
  //       request.args ?? [],
  //     ],
  //     subscriptionId,
  //     200000,
  //     maxPriorityFeePerGas!.add(lastBaseFeePerGas!)
  //   )
  //   // Ensure the subscription has a sufficent balance
  //   console.log("need link",utils.formatUnits(estimatedCostJuels,18))

  // functinConsumer
  console.log("start generate request");
  const functionsRequestBytes = await functinConsumer.generateRequest(
    request.source,
    request.secrets ?? [],
    request.args
  );
  console.log("Setting Functions request");
  const setRequestTx = await functinConsumer.setRequest(functionsRequestBytes);
  await setRequestTx.wait(2);

  console.log(setRequestTx);

  // Check that the subscription is valid
  let subInfo;
  try {
    subInfo = await registryFactory.getSubscription(subscriptionId);
  } catch (error: any) {
    if (error.errorName === "InvalidSubscription") {
      throw Error(
        `Subscription ID "${subscriptionId}" is invalid or does not exist`
      );
    }
    throw error;
  }
  // Validate the client contract has been authorized to use the subscription
  const existingConsumers = subInfo[2].map((addr: any) => addr.toLowerCase());
  if (!existingConsumers.includes(functinConsumerAddress.toLowerCase())) {
    throw Error(
      `Consumer contract ${functinConsumerAddress} is not registered to use subscription ${subscriptionId}`
    );
  }

  // Estimate the cost of the request

  // Ensure that the subscription has a sufficient balance

  //  TODO: add cost of this LINK in USD

  // doGistCleanup indicates if an encrypted secrets Gist was created automatically and should be cleaned up once the request is complete

  // Use a promise to wait & listen for the fulfillment event before returning
  await new Promise(async (resolve, reject) => {
    let requestId: any;

    // Initiate the listeners before making the request
    // Listen for fulfillment errors

    // Listen for successful fulfillment, both must be true to be finished
    let billingEndEventReceived = false;
    let ocrResponseEventReceived = false;
    functinConsumer.on("OCRResponse", async (eventRequestId, result, err) => {
      // Ensure the fulfilled requestId matches the initiated requestId to prevent logging a response for an unrelated requestId
      if (eventRequestId !== requestId) {
        return;
      }

      console.log(
        `Request ${requestId} fulfilled! Data has been written on-chain.\n`
      );
      if (result !== "0x") {
        console.log(
          `Response returned to client contract represented as a hex string: ${ethers.utils.toUtf8String(
            result
          )}\n
          Response returned to client contract represented as a hex string: ${result}\n`
        );
      }
      if (err !== "0x") {
        console.log(
          `Error message returned to client contract: "${Buffer.from(
            err.slice(2),
            "hex"
          )}"\n`
        );
      }
      ocrResponseEventReceived = true;
    });

    // Initiate the on-chain request after all listeners are initialized
    console.log("Sending Functions request");
    const sendRequestTx = await functinConsumer.sendRequest();
    console.log("Waiting 2 blocks for transaction to be confirmed...");
    const requestTxReceipt = await sendRequestTx.wait(2);
    console.log(
      `Transaction confirmed, see ${requestTxReceipt.hash}
      } for more details.`
    );

    requestId = requestTxReceipt.events[2].args.id;
    console.log(
      `Request ${requestId} has been initiated. Waiting for fulfillment from the Decentralized Oracle Network...\n`
    );

    // If a response is not received in time, the request has exceeded the Service Level Agreement
    // setTimeout(async () => {
    //   console.log(
    //     "A response has not been received within 5 minutes of the request being initiated and has been canceled. Your subscription was not charged. Please make a new request."
    //   )

    //   reject()
    // }, 300_000) // TODO: use registry timeout seconds
  });
};
