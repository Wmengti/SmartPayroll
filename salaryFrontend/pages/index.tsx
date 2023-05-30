/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-29 19:46:16
 * @Description:
 */
import Image from 'next/image';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/config';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : SITE_URL;

  const links = [
    {
      title: 'Start',
      description:
        'Seamlessly integrate your decentralized application with Next.js, a popular React-based framework.',
      href: '/CreateTask',
    },
  ];
  return (
    <main
      className={`flex  min-h-[90vh]  items-center justify-around  p-10 ${inter.className}`}
    >
      <Head>
        <title>{SITE_NAME}</title>
        <meta name='description' content={SITE_DESCRIPTION} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/entericon.png' />
      </Head>

      <div className='flex flex-col w-[50vw] items-center justify-center'>
        <div className="relative flex mt-20 place-items-center justify-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          <p className='text-4xl'>Smart Payroll</p>
        </div>
        <div className='mb-32 text-center lg:mb-0  lg:text-left mt-24 lg:mt-0'>
          <Link
            href='/CreateTask'
            className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            rel='noopener noreferrer'
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Starts
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Seamlessly integrate your decentralized application with Next.js,
              a popular React-based framework.
            </p>
          </Link>
        </div>
      </div>
      <div className='w-[40vw] bg-black '>
        <Box bg='red.100' w='40vw' color='red' ></Box>
      </div>
    </main>
  );
}
