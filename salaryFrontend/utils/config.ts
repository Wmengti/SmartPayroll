/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 14:27:33
 * @Description: 
 */
import { mainnet, polygon, sepolia, polygonMumbai } from 'wagmi/chains';
import { ethers } from 'ethers';

export const ETH_CHAINS = [mainnet, polygon, sepolia, polygonMumbai];
export const WALLET_CONNECT_PROJECT_ID = 'YOUR_WALLET_CONNECT_PROJECT_ID';

export const SITE_NAME = 'boilr3';
export const SITE_DESCRIPTION =
	'The Ultimate Next.js dApp Boilerplate with RainbowKit, Tailwind CSS & WAGMI';
export const SITE_URL = 'https://boilr3.vercel.app';

export const SOCIAL_TWITTER = 'Envoy_1084';
export const SOCIAL_GITHUB = 'Envoy-VC/boilr3';

export const NFT_CONTRACT_ADDRESS =
	'0x0Fc5f8A784810dEd101BD734cC59F6F7b868A3AF';

export const ironOptions = {
	cookieName: SITE_NAME,
	password:
		process.env.SESSION_PASSWORD ??
		'set_a_complex_password_at_least_32_characters_long',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},

	
};

export const configProvider = ()=>{
	const provider = new ethers.providers.JsonRpcProvider(
		'https://polygon-mumbai.g.alchemy.com/v2/' +
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
	)
	const signer = new ethers.Wallet(
		process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider
	)
	const getProvider = () => provider;
  const getSigner = () => signer;

  return { getProvider, getSigner };

}

export const networkConfig = {
  hardhat: {
    // TODO: for networks other than mainnet, gas costs should be calculated the native token, not ETH
    functionsPublicKey:
      '971f006163a12ee3383a00d7743334480d6b1c83fdf60497e0c520b16d1a4ee421cc61375679b63466156fee6f2f1da5a7e630ba0b1cddb2704ef907ead223db',
    mockFunctionsPrivateKey:
      '0x09768a19def4dce2b6793d7dc807828ef47b681709cf1005627a93f0da9c8065',
  },
  mainnet: {
    linkToken: '0x514910771af9ca656af840dff83e8264ecf986ca',
  },
  polygon: {
    linkToken: '0xb0897686c545045afc77cf20ec7a532e3120e0f1',
  },
  polygonMumbai: {
    functionFactory:'0xFef062C4d9DA6cE8877C13381D4bc6dB63e30c1F',
    linkToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    linkEthPriceFeed: '0x12162c3E810393dEC01362aBf156D7ecf6159528',
    functionsOracleProxy: '0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4',
    functionsBillingRegistryProxy: '0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039',
    functionsPublicKey:
      'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c',
  },
  sepolia: {
    linkToken: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    linkEthPriceFeed: '0x42585eD362B3f1BCa95c640FdFf35Ef899212734',
    functionsOracleProxy: '0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC',
    functionsBillingRegistryProxy: '0x3c79f56407DCB9dc9b852D139a317246f43750Cc',
    functionsPublicKey:
      'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c',
  },
};

// This is set to 2 for speed & convenience.  For mainnet deployments, it is recommended to set this to 6 or higher
export const VERIFICATION_BLOCK_CONFIRMATIONS = 2;

export const NETWORK ="polygonMumbai";

export const functionFactoryABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint64","name":"","type":"uint64"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"autoFunctionEvent","type":"event"},{"inputs":[{"internalType":"address","name":"oracle","type":"address"},{"internalType":"uint64","name":"_subscriptionId","type":"uint64"},{"internalType":"uint32","name":"_fulfillGasLimit","type":"uint32"},{"internalType":"uint256","name":"_updateInterval","type":"uint256"}],"name":"createAutomatedFunctions","outputs":[],"stateMutability":"nonpayable","type":"function"}]
