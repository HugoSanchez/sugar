import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
	const { login, logout, authenticated, ready, user } = usePrivy();
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push('/');
	};

	return {
		login,
		logout: handleLogout,
		authenticated,
		ready,
		user
	};
}
