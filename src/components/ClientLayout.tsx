'use client';

import { useState } from 'react';
import { Providers } from '@/app/providers';
import Header from './Header';
import SlidingMenuLayout from './SlidingMenuLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
