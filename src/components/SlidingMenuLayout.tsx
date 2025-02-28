'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SlidingMenuLayoutProps {
	children: React.ReactNode;
	isMenuOpen: boolean;
	onClose: () => void;
}

const SlidingMenuLayout = ({ children, isMenuOpen, onClose }: SlidingMenuLayoutProps) => {
	const { authenticated, logout } = useAuth();
	const router = useRouter();

	const handleProfileClick = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push('/profile');
	};

	return (
		<div className="relative min-h-screen overflow-hidden">
			{authenticated && (
				<div
					className={`fixed z-20 inset-y-0 left-0 h-screen w-64 bg-white text-black border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<nav className="p-4 md:pl-14 pt-20">
						<ul className="space-y-4">
							<li><Link href="/read" className="block p-2 rounded hover:italic">read.</Link></li>
							<li><Link href="/write" className="block p-2 rounded hover:italic">write.</Link></li>
							<li>
								<button
									onClick={handleProfileClick}
									className="block p-2 rounded hover:italic w-full text-left"
								>
									profile.
								</button>
							</li>
							<li><Link href="/profile" className="block p-2 rounded hover:italic">settings.</Link></li>

							<li>
								<Button
									onClick={logout}
									variant="secondary"
									className="absolute bottom-10 left-4 md:left-14"
								>
									logout
									<LogOut className="h-4 w-4 text-gray-100" />
								</Button>
							</li>
						</ul>
					</nav>
				</div>
			)}

			<div onClick={onClose}>
				<main className="p-4 h-[calc(100vh-64px)] overflow-auto">
					{children}
				</main>
			</div>
		</div>
	);
};

export default SlidingMenuLayout;
