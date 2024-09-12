'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function MintButton() {
	const { login, user, authenticated } = usePrivy();
	const { wallets } = useWallets();

	const handleMint = async () => {
		if (!authenticated || !user) {
			console.log('login');
			login();
		}
		else if (wallets.length > 0) {
			console.log('wallets', wallets);
			const activeWallet = await wallets[0].loginOrLink();
			// const sig = await activeWallet('Mint message');
			console.log(activeWallet);
		}
	}

	return (
		<div
			onClick={handleMint}
			className="border-black border px-4 py-2 cursor-pointer">
			<p className='text-base'>Post.</p>
		</div>
	)
}
