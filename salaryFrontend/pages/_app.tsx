/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-05 11:01:26
 * @Description: 
 */
import type { AppProps } from 'next/app';
import Web3Provider from '@/providers/Web3';
import { SEO } from '@/components/layout';
import Navigation from '@/components/layout/Navigation';
import { SITE_URL } from '@/utils/config';
import { ChakraProvider } from '@chakra-ui/react';
import {TaskContextProvider} from '@/contexts/taskProvider'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	const origin =
	typeof window !== 'undefined' && window.location.origin
		? window.location.origin
		: SITE_URL;
	return (
		<Web3Provider>
			<ChakraProvider>
				<TaskContextProvider>
					<Navigation origin={origin}/>
					<SEO />
					<Component {...pageProps} />
					<ToastContainer />
				</TaskContextProvider>
			</ChakraProvider>
			
		</Web3Provider>
	);
}
