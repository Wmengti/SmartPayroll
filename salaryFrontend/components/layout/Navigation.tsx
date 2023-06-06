import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {useAccount} from 'wagmi'
import {useEffect,useMemo,useState} from "react";
import { ethers,utils } from 'ethers';
import ERC20ABI from '@/constants/ERC20ABI.json';
import creditToken from "@/constants/creditTokenAddress.json";
import {NETWORK} from "@/utils/config"
/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-06 14:24:29
 * @Description: 
 */
interface Props {
  origin:string;
}
const Navigation = (props:Props)=>{
  const [balance,setBalance]= useState(0)
  const {address} = useAccount();
  const token_address = creditToken[NETWORK];
  const provider = () => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window as any;
      const provider = new ethers.providers.Web3Provider(ethereum);
      return provider;
    }
  };
  const credit = useMemo(() => {
    const currentProvider = provider();
    if (typeof window !== 'undefined') {
      const credit = new ethers.Contract(
        creditToken[NETWORK],
        ERC20ABI,
        currentProvider
      );
      return credit;
    }

  }, []);
  useEffect(()=>{
    const getBalance = async ()=>{
      const balanceBignumber =await credit?.balanceOf(address);
      const balance = parseInt(utils.formatEther(balanceBignumber));
      console.log(balance);
      setBalance(balance);

    }
    getBalance()


  },[])
  return (
  <div className='flex flex-col h-[10vh] items-center justify-between pt-2 px-10'>
  <div className='z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex '>
    <div className='fixed left-0 top-0 flex w-full justify-center gap-10 text-lg font-mono font-bold  lg:static lg:w-auto   lg:p-4 '>
      <Link 
      href={props.origin}
      className='rounded-lg border p-2 border-transparent transition-colors hover:border-gray-600 hover:border-neutral-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        Home
      </Link>
      <Link 
      href={`${props.origin}/CreateTask`}
      className='rounded-lg border p-2 border-transparent transition-colors hover:border-gray-600 hover:border-neutral-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        Create Task
      </Link>
      <Link 
      href={`${props.origin}/CheckMoment/${address}`}
      className='rounded-lg border p-2 border-transparent transition-colors hover:border-gray-600 hover:border-neutral-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        Check Moment
      </Link>
      
    </div>
    <div className='bottom-0 left-0 flex items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-24 lg:my-0'>
    <Link 
      href={`https://mumbai.polygonscan.com/token/${token_address}`}
      className='rounded-lg border p-2 font-mono font-bold border-transparent transition-colors hover:border-gray-600 hover:border-neutral-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        Credit {balance}
      </Link>
      <ConnectButton chainStatus='none'/>
    </div>
  </div>
  </div>
  )

}

export default Navigation;