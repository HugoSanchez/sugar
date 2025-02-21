'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Providers } from '@/app/providers';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Header from './Header';
import SlidingMenuLayout from './SlidingMenuLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { authenticated } = useAuth();
	const { hasProfile, isLoading } = useProfile();
	const router = useRouter();

	useEffect(() => {
		// Only redirect if we're authenticated, have checked the profile status,
		// and we're not already on the create profile page
		if (authenticated && !isLoading && !hasProfile && window.location.pathname !== '/profile/create') {
			router.push('/profile/create');
		}
	}, [authenticated, hasProfile, isLoading, router]);

	const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsMenuOpen(prev => !prev);
	};

	const closeMenu = () => {
		if (isMenuOpen) {
			setIsMenuOpen(false);
		}
	};

	return (
		<Providers>
			<Header onMenuClick={toggleMenu} />
			<SlidingMenuLayout isMenuOpen={isMenuOpen} onClose={closeMenu}>
				{children}
			</SlidingMenuLayout>
		</Providers>
	);
}
