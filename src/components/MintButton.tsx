import React, { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import MinimalProfileRegistry from '../artifacts/contracts/MinimalProfileRegistry.sol/ProfileRegistry.json';

// Replace with your actual contract address
const PROFILE_REGISTRY_ADDRESS = '0x...';

const MintButton: React.FC = () => {
	const { login, authenticated, ready, user } = usePrivy();
	const { wallets } = useWallets();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);

	useEffect(() => {
		if (authenticated && wallets.length > 0) {
			checkProfile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, wallets]);

	const checkProfile = useCallback(async () => {
		if (wallets.length === 0) return;
		try {
			const wallet = wallets[0]; // Assume using the first wallet
			const provider = await wallet.getEthersProvider();
			const signer = provider.getSigner();
			console.log('signer:', signer);
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

	const handleClick = () => {
		if (!authenticated) {
			login();
		} else if (hasProfile === null) {
			console.log('user:', user);
			checkProfile();
		}
	};

	if (!ready) {
		return <div></div>;
	}

	if (!authenticated) {
		return <button
			className="text-black font-light text-lg hover:opacity-60 md:mr-4 py-2 px-4"
			onClick={handleClick}>Connect</button>;
	}

	return (
		<button
			className="text-black text-xl hover:opacity-60 md:mr-4 py-2 px-4"
			onClick={handleClick}>
				Post
		</button>
	);
};

export default MintButton;
