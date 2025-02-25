import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { getUserByPrivyId, createUser } from '@/lib/db';
import { useEffect, useRef, useState } from 'react';
import { User } from '@/lib/types';

export function useAuth() {
	const { login: privyLogin, logout, authenticated, ready, user: privyUser } = usePrivy();
	const router = useRouter();
	const loginHandled = useRef(false);
	const [dbUser, setDbUser] = useState<User | null>(null);

	useEffect(() => {
		async function handleUserLogin() {
			if (!privyUser || !authenticated || loginHandled.current) return;
			loginHandled.current = true;

			try {
				const existingUser = await getUserByPrivyId(privyUser.id);

				if (!existingUser && privyUser.wallet?.address && privyUser.email?.address) {
					const newUser = await createUser({
						privyId: privyUser.id,
						walletAddress: privyUser.wallet.address,
						emailAddress: privyUser.email.address,
						username: '',
						name: '',
						description: '',
						farcasterAddress: ''
					});
					setDbUser(newUser);
					router.push('/profile');
				} else if (existingUser) {
					setDbUser(existingUser);
					if (!existingUser.username) {
						router.push('/profile');
					}
				}
			} catch (error) {
				console.error('Error handling login:', error);
				loginHandled.current = false; // Reset on error to allow retry
			}
		}

		handleUserLogin();
	}, [privyUser, authenticated, router]);

	const handleLogout = async () => {
		await logout();
		loginHandled.current = false;
		setDbUser(null);
		router.push('/');
	};

	return {
		login: privyLogin,
		logout: handleLogout,
		authenticated,
		ready,
		user: dbUser,
		privyUser
	};
}
