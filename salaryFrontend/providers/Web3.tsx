/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-05 17:24:32
 * @Description:
 */
/* eslint-disable react/no-children-prop */
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useEffect } from "react";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { ReactNode } from "react";

import { ETH_CHAINS, WALLET_CONNECT_PROJECT_ID } from "@/utils/config";
import "@rainbow-me/rainbowkit/styles.css";

import { useNetwork, useSwitchNetwork } from "wagmi";

interface Props {
  children: ReactNode;
}

const projectId = WALLET_CONNECT_PROJECT_ID;

const { chains, provider } = configureChains(ETH_CHAINS, [publicProvider()]);
// const { chain: currentChain } = useNetwork();

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName: "SmartPayroll" }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const Web3Provider = (props: Props) => {
  // 	const { chain:currentChain} = useNetwork()
  // 	const { switchNetwork } =
  //     useSwitchNetwork();

  // 	useEffect(() => {
  // 	if (currentChain && currentChain.name !== "polygonMumbai") {
  // 		switchNetwork(80001)
  // 	}
  // }, [currentChain]);
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          lightMode: lightTheme({ overlayBlur: "small" }),
          darkMode: darkTheme({ overlayBlur: "small" }),
        }}
        appInfo={{
          appName: "SmartPayroll",
          learnMoreUrl: "https://github.com/Wmengti/SmartPayroll",
        }}
        children={props.children}
      ></RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
