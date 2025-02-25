import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { getUserByPrivyId, createUser } from '@/lib/db';

export function useAuth() {
	const { login: privyLogin, logout, authenticated, ready, user } = usePrivy();
	// const { wallets } = useWallets();
	const router = useRouter();

	const handleLogin = async () => {
		await privyLogin();

		if (user) {
			console.log('user logged in:', user);

			try {
				// Check if user exists by their Privy ID
				const existingUser = await getUserByPrivyId(user.id);

				// If user doesn't exist, create them with required fields
				if (!existingUser && user.wallet?.address && user.email?.address) {
					await createUser({
						id: crypto.randomUUID(), // Generate a unique ID
						privyId: user.id,
						walletAddress: user.wallet.address,
						emailAddress: user.email.address,
						username: '',
						name: '',
						description: '',
						farcasterAddress: user.wallet.address // Optional: use same address for Farcaster
					});
					router.push('/profile');
				} else if (existingUser && !existingUser.username) {
					// If user exists but hasn't set a username
					router.push('/profile');
				}
			} catch (error) {
				console.error('Error handling login:', error);
			}
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push('/');
	};

	return {
		login: handleLogin,
		logout: handleLogout,
		authenticated,
		ready,
		user,
	};
}
