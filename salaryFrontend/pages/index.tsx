/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-05 19:10:15
 * @Description:
 */
import Image from 'next/image';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/config';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNetwork,useSwitchNetwork } from 'wagmi'


const inter = Inter({ subsets: ['latin'] });
interface propsTypes {
  id: string;
  title: string;
}

export default function Home(props:any) {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : SITE_URL;
  console.log(props);
  // const chainID:number= 80001;

 	const { chain:currentChain} = useNetwork()
	const { switchNetwork } =
    useSwitchNetwork();

  
   
  

	useEffect(() => {
	if (currentChain && currentChain.name !== "polygonMumbai") {
    if (typeof switchNetwork === 'function'){
      switchNetwork(80001)
    }
    
		
	}
}, [currentChain]);


  return (
    <main
      className={`flex  min-h-[90vh]  items-center justify-around  p-10 ${inter.className}`}
    >
      <Head>
        <title>{SITE_NAME}</title>
        <meta name='description' content={SITE_DESCRIPTION} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/money.png' />
      </Head>

      <div className='flex flex-col w-[50vw] items-center  justify-center'>
        <div className="relative flex my-20 place-items-center  before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          <p className='text-4xl'>Smart Payroll</p>
        </div>
        <div className='mb-32 text-center lg:mb-0  lg:text-left mt-24 lg:mt-0'>
          <Link
            href='/CreateTask'
            className='group rounded-lg border border-transparent  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            rel='noopener noreferrer'
          >
            <h2 className={`mb-3 text-2xl mt-10 font-semibold`}>
              Start
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[40ch] text-md opacity-50`}>
            Create a smart payroll contract for your employees
            </p>
          </Link>
        </div>
      </div>
      <div className='w-[40vw]  '>
        <h2 className='text-2xl font-semibold px-3 pb-3'>DAO vote link</h2>
        <Box bg='white' w='40vw' h='70vh' px={8} py={5}  borderWidth={10} borderRadius={40}>
          <ul>
          {
            props.proposals.map((proposal:propsTypes, index: number)=>(
              <li key={proposal.id}>
              <Link href={`https://demo.snapshot.org/#/0x3c.eth/proposal/${proposal.id}`} key={proposal.id} className='hover:underline'>
              {index + 1}. {proposal.title}
            </Link>
            </li>
            ))

          }
          </ul>
           
        </Box>
      </div>
    </main>
  );
}


export async function getStaticProps() {
  const config = {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: "space",
        query: `
          query space{
            proposals (
              first: 20,
              skip: 0,
              where: {
                space_in: ["0x3c.eth"],
                state: "closed"
              },
              orderBy: "created",
              orderDirection: desc
            ) {
             id
            title 
            }
          }
       `,
        variables: null,
      }),
  }

    const response = await fetch('https://testnet.snapshot.org/graphql?', config)
   
    const data= await response.json();
    // console.log(data)
    
 
  

  return {
    props: {
      proposals:
      data.data.proposals.map((proposal:propsTypes)=>({
          id: proposal.id,
          title: proposal.title
        }))
      
    
     
    },
    revalidate: 10, 
  };
}
