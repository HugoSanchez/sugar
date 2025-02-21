import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
// import { getProfileByUsername, createProfile } from '@/lib/db';

export function useAuth() {
	const { login: privyLogin, logout, authenticated, ready, user } = usePrivy();
	const router = useRouter();

	const handleLogin = async () => {
		// First do the Privy login
		await privyLogin();
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
		user
	};
}
