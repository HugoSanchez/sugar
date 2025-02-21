import { usePrivy } from '@privy-io/react-auth';

export function LoginButton() {
	const { login, logout, authenticated, ready } = usePrivy();

	if (!ready) return null;

	if (authenticated) {
		return (
			<button
				onClick={logout}
				className="font-medium text-gray-700 hover:text-gray-900"
			>
        Logout
			</button>
		);
	}

	return (
		<button
			onClick={login}
			className="font-medium text-gray-700 hover:text-gray-900"
		>
      Login
		</button>
	);
}
