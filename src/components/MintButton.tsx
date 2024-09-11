'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function MintButton() {
	const { login, user, authenticated } = usePrivy();

	const handleMint = () => {
		if (!authenticated || !user) {
			login();
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
