import React, { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import MinimalProfileRegistry from '../artifacts/contracts/MinimalProfileRegistry.sol/ProfileRegistry.json';

// Replace with your actual contract address
const PROFILE_REGISTRY_ADDRESS = '0x...';

const PostButton = ({editorContent}: {editorContent: string}) => {
	const { login, authenticated, logout} = usePrivy();
	const { wallets } = useWallets();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);

	useEffect(() => {
		if (authenticated && wallets.length > 0) {
			checkUserProfile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, wallets]);

	// Top level function that handles the post button
	// Depending on the user's authentication state,
	// it triggers the appropriate action/function.
	const handlePostDynamic = async () => {
		console.log('editorContent:', editorContent);
		if (!authenticated) {
			await login();
		}
	};

	const checkUserProfile = useCallback(async () => {
		if (wallets.length === 0) return;
		try {
			const wallet = wallets[0]; // Assume using the first wallet
			const provider = await wallet.getEthersProvider();
			const signer = provider.getSigner();
			console.log('signer:', signer);
			console.log('hasProfile:', hasProfile);
			return
			const contract = new ethers.Contract(PROFILE_REGISTRY_ADDRESS, MinimalProfileRegistry.abi, signer);

			const address = await signer.getAddress();
			const balance = await contract.balanceOf(address);
			setHasProfile(balance.gt(0));
		} catch (error) {
			console.error('Error checking profile:', error);
			setHasProfile(null);
		}
	}, [wallets]);

	if (!authenticated) {
		return <button onClick={() => login()}>
			<p className='text-black text-base'>login.</p>
		</button>
	}

	if (authenticated) {
		return <button onClick={() =>logout()}>
			<p className='text-black text-base'>logout.</p>
		</button>
	}


	return (
		<button onClick={handlePostDynamic}>
			<p className='text-black text-base'>post.</p>
		</button>
	);
};

export default PostButton;
