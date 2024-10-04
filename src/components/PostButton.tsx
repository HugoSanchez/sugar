import React, { useState, useCallback, useEffect } from 'react';
import { usePrivy, useWallets, ConnectedWallet } from '@privy-io/react-auth';
import { getProfileRegistryContract, getFactoryContract } from '../lib/contracts';
import { ethers } from 'ethers';



const PostButton = ({editorContent}: {editorContent: string}) => {
	const { login, authenticated, logout} = usePrivy();
	const { wallets } = useWallets();
	const [isLoading, setIsLoading] = useState(false);
	const [isAwaitingLogin, setIsAwaitingLogin] = useState(false);
	const [hasProfile, setHasProfile] = useState(false);
	const [wallet, setWallet] = useState<ConnectedWallet>();
	const [signer, setSigner] = useState<ethers.Signer>();

	useEffect(() => {
		if (authenticated) {
			checkUserAndSetState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [authenticated]);


	useEffect(() => {
	  if (isAwaitingLogin && authenticated) {
			handlePostAfterLogin();
	  }
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, isAwaitingLogin]);

	// Check if user has profile and set state
	const checkUserAndSetState = async () => {
		if (wallets.length === 0) return;
		const wallet = wallets[0];
		const provider = await wallet.getEthersProvider();
		const signer = provider.getSigner();
		const profileContract = getProfileRegistryContract(signer);
		const address = await signer.getAddress();
		const balance = await profileContract.balanceOf(address);
		setHasProfile(balance.gt(0));
		setSigner(signer);
		setWallet(wallet);
	}

	const handleLogIn = useCallback(async () => {
		await login();
	}, [login]);

	const handleLogOut = useCallback(async () => {
		await logout();
	}, [logout]);

	const handlePost = useCallback(async () => {
		if (!authenticated) {
			setIsAwaitingLogin(true);
			await login();
			return;
		}
		handlePostAfterLogin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated]);

	const handlePostAfterLogin = async () => {
	  setIsLoading(true);
	  setIsAwaitingLogin(false);
	  try {
			if (wallets.length === 0) {
				console.error('No wallets available');
				return;
			}

			const wallet = wallets[0];
			const provider = await wallet.getEthersProvider();
			const signer = provider.getSigner();



			const factoryContract = getFactoryContract(signer);

			if (hasProfile) {
				await createPost(factoryContract, editorContent);
			} else {
				await createProfileAndPost(factoryContract, editorContent);
			}

	  } catch (error) {
			console.error('Error in post process:', error);
	  } finally {
			setIsLoading(false);
	  }
	};


	// Function to create a profile and post
	const createProfileAndPost = async (contract: ethers.Contract, editorContent: string) => {
		console.log('Creating profile and posting...', contract);
		console.log('Editor content:', editorContent);
	};

	// Function to create a post
	const createPost = async (contract: ethers.Contract, editorContent: string) => {
		console.log('Posting...', contract);
		console.log('Editor content:', editorContent);
	};


	/**
	if (!authenticated) {
		return <button onClick={handleLogIn}>
			<p className='text-black text-base'>login.</p>
		</button>
	}

	if (authenticated) {
		return <button onClick={handleLogOut}>
			<p className='text-black text-base'>logout.</p>
		</button>
	}

	if (isLoading) {
		return <div>
			<div className="animate-spin rounded-full h-3 w-3 border border-t-transparent border-black"/>
		</div>
	}
	*/

	return (
		<div className='fixed bottom-16 right-0 h-16 w-screen'>
			<button
				disabled={isLoading}
				onClick={handlePost}
				className='z-20 absolute bottom-0 right-4 md:right-6 px-8 md:px-12 py-3 md:py-4 bg-gray-900 shadow-lg rounded-md hover:bg-gray-800'
			>
				<p className='text-white text-base mb-1'>post.</p>
			</button>
		</div>

	);
};

export default PostButton;
