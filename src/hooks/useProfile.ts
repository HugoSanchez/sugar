import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getProfileByUsername } from '@/lib/db';

export function useProfile() {
	const { user, authenticated } = useAuth();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkProfile() {
			if (!authenticated || !user?.id) {
				setHasProfile(false);
				setIsLoading(false);
				return;
			}

			try {
				const profile = await getProfileByUsername(user.id);
				setHasProfile(!!profile);
			} catch (error) {
				console.error('Error checking profile:', error);
				setHasProfile(false);
			} finally {
				setIsLoading(false);
			}
		}

		checkProfile();
	}, [authenticated, user?.id]);

	return { hasProfile, isLoading };
}
