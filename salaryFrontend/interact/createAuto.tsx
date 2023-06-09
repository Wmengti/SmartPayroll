/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-26 16:02:10
 * @Description:
 */
import { utils, ethers } from 'ethers';
import {
  networkConfig,
  NETWORK,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '@/utils/config';
import functionsBillingRegistryProxyABI from '@/constants/FunctionsBillingRegistryABI.json';
import functionsOracleProxyABI from '@/constants/functionsOracleProxyABI.json';
import linkTokenABI from '@/constants/linktokenABI.json';
import functionAutoConsumerABI from '@/constants/functionAutoConsumerABI.json';
import { configProvider } from '@/utils/config';
import getRequestConfig from '@/contracts/Functions-request-config';
import smartPayrollFactoryAddress from '@/constants/smartPayrollFactoryAddress.json';
import smartPayrollFactoryABI from '@/constants/smartPayrollFactoryABI.json';
import KeeperAutoSelfRegisterAddress from '@/constants/keeperAutoSelfRegisterAddress.json';
import functionsFactoryABI from '@/constants/functionsFactoryABI.json';
import functionsFatoryAddress from '@/constants/functionsFactoryAddress.json';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

import { buildRequest } from '@/FunctionsSandboxLibrary';

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

export const createAuto = async (Params: ParamsConfigType) => {
  // connect address

  const signer = configProvider().getSigner();
  // const signer = () => {
  //   if (typeof window !== "undefined") {
  //     const { ethereum } = window as any
  //     const provider = new ethers.providers.Web3Provider(ethereum)
  //     const signer = provider.getSigner()
  //     return signer
  //   }
  // }
  // const currentSigner = signer();
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
  const isWalletAllowed = await oracle.isAuthorizedSender(Params.address);

  if (!isWalletAllowed)
    return console.log(
      '\nChainlink Functions is currently in a closed testing phase.\nFor access sign up here:\nhttps://functions.chain.link'
    );
  console.log('Creating Functions billing subscription');
  toast('Creating Functions billing subscription', {
    position: 'top-center',
    autoClose: 5000,
  });
  const createSubscriptionTx = await registryFactory.createSubscription();
  const createSubscriptionReceipt = await createSubscriptionTx.wait(2);
  const subscriptionId =
    createSubscriptionReceipt.events[0].args['subscriptionId'].toNumber();
  console.log(`Subscription created with ID: ${subscriptionId}`);
  toast(`Subscription created with ID: ${subscriptionId}`, {
    position: 'top-center',
    autoClose: 5000,
  });

  // check address for LINK balance
  const linkBalance = await linkToken.balanceOf(Params.address);
  console.log(linkBalance);
  toast(`link balance: ${linkBalance}`, {
    position: 'top-center',
    autoClose: 5000,
  });
  const juelsAmount = ethers.utils.parseUnits('0.5');
  if (juelsAmount.gt(linkBalance)) {
    toast(
      `Insufficent LINK balance. Trying to fund subscription with ${ethers.utils.formatEther(
        juelsAmount
      )} LINK, but only have ${ethers.utils.formatEther(linkBalance)}.`,
      {
        position: 'top-center',
        autoClose: 5000,
      }
    );
    throw Error(
      `Insufficent LINK balance. Trying to fund subscription with ${ethers.utils.formatEther(
        juelsAmount
      )} LINK, but only have ${ethers.utils.formatEther(linkBalance)}.`
    );
  }
  const fundTx = await linkToken.transferAndCall(
    networkConfig[NETWORK].functionsBillingRegistryProxy,
    juelsAmount,
    ethers.utils.defaultAbiCoder.encode(['uint64'], [subscriptionId])
  );
  await fundTx.wait(2);
  console.log(
    `Subscription ${subscriptionId} funded with ${ethers.utils.formatEther(
      juelsAmount
    )} LINK`
  );
  toast(
    `Subscription ${subscriptionId} funded with ${ethers.utils.formatEther(
      juelsAmount
    )} LINK`,
    {
      position: 'top-center',
      autoClose: 5000,
    }
  );
  //deply functionFactory automation consumer
  console.log('create automation functions');
  toast('create automation functions', {
    position: 'top-center',
    autoClose: 5000,
  });
  // const timestamp = new Date(Params.endTime).getTime()
  // console.log(Params.endTime)
  // console.log(timestamp/1000)
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
  console.log(deployReceipt.events);
  console.log(deployReceipt.events[1].args[0]);
  const functinConsumerAddress = deployReceipt.events[1].args[0];
  toast(`automation functions address: ${functinConsumerAddress}`, {
    position: 'top-center',
    autoClose: 5000,
  });

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
  console.log(Params.proposalID);
  if (Params.proposalID == '') {
    toast('proposalID is null', {
      position: 'top-center',
      autoClose: 5000,
    });
  } else {
    toast(`proposalID is ${Params.proposalID}`, {
      position: 'top-center',
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
  console.log('start generate request');
  toast('start generate request', {
    position: 'top-center',
    autoClose: 5000,
  });
  const functionsRequestBytes = await functinConsumer.generateRequest(
    request.source,
    request.secrets ?? [],
    request.args
  );
  console.log('Setting Functions request');
  const setRequestTx = await functinConsumer.setRequest(functionsRequestBytes);
  await setRequestTx.wait(2);

  console.log(setRequestTx);

  toast('send to automation ', {
    position: 'top-center',
    autoClose: 5000,
  });
  ////////////////////////////////////////////////////////////////
  const registrarParams = [
    `${Params.contractName}_functions`,
    utils.formatBytes32String(''),
    functinConsumerAddress,
    '700000',
    '0xb1BfB47518E59Ad7568F3b6b0a71733A41fC99ad',
    utils.formatBytes32String(''),
    utils.formatBytes32String(''),
    utils.parseUnits('0.5', 18),
  ];
  const smartPayrollFactory = new ethers.Contract(
    smartPayrollFactoryAddress[NETWORK],
    smartPayrollFactoryABI,
    signer
  );
  let tx = await smartPayrollFactory?.createKeeper(
    KeeperAutoSelfRegisterAddress[NETWORK],
    registrarParams
  );

  const receipt = await tx.wait(1);

  const upKeepId = BigInt(receipt.events[3].topics[1]).toString();
  console.log('upkeep', upKeepId);
  toast('functions automatically updated,upKeepId: ' + upKeepId, {
    position: 'top-center',
    autoClose: 5000,
  });
  ////////////////////////////////////////////////////////////////
};
