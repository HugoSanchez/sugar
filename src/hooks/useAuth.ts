import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { getUserByPrivyId, createUser } from '@/lib/db';
import { useEffect, useRef } from 'react';

export function useAuth() {
	const { login: privyLogin, logout, authenticated, ready, user } = usePrivy();
	const router = useRouter();
	const loginHandled = useRef(false);

	useEffect(() => {
		async function handleUserLogin() {
			if (!user || !authenticated || loginHandled.current) return;
			loginHandled.current = true;

			try {
				const existingUser = await getUserByPrivyId(user.id);

				if (!existingUser && user.wallet?.address && user.email?.address) {
					await createUser({
						privyId: user.id,
						walletAddress: user.wallet.address,
						emailAddress: user.email.address,
						username: '',
						name: '',
						description: '',
						farcasterAddress: ''
					});
					router.push('/profile');
				} else if (existingUser && !existingUser.username) {
					router.push('/profile');
				}
			} catch (error) {
				console.error('Error handling login:', error);
				loginHandled.current = false; // Reset on error to allow retry
			}
		}

		handleUserLogin();
	}, [user, authenticated, router]);

	const handleLogout = async () => {
		await logout();
		loginHandled.current = false;
		router.push('/');
	};

	return {
		login: privyLogin,
		logout: handleLogout,
		authenticated,
		ready,
		user
	};
}
