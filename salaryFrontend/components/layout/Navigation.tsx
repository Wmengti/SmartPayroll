import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-19 21:01:17
 * @Description: 
 */
interface Props {
  origin:string;
}
const Navigation = (props:Props)=>{
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
      href={`${props.origin}/CheckMoment`}
      className='rounded-lg border p-2 border-transparent transition-colors hover:border-gray-600 hover:border-neutral-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
        Check Moment
      </Link>
      
    </div>
    <div className='bottom-0 left-0 flex items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-24 lg:my-0'>
      <ConnectButton chainStatus='none'/>
    </div>
  </div>
  </div>
  )

}

export default Navigation;