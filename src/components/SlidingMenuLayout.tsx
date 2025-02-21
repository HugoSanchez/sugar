'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface SlidingMenuLayoutProps {
	children: React.ReactNode;
	isMenuOpen: boolean;
	onClose: () => void;
}

const SlidingMenuLayout = ({ children, isMenuOpen, onClose }: SlidingMenuLayoutProps) => {
	const { authenticated, logout, user } = useAuth();

	return (
		<div className="relative min-h-screen overflow-hidden">
			{authenticated && (
				<div
					className={`fixed z-20 inset-y-0 left-0 h-screen w-64 bg-gray-50 opacity-90 text-black border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<nav className="p-4 md:pl-14 pt-20">
						<ul className="space-y-4">
							<li><Link href="/read" className="block p-2 rounded hover:italic">read.</Link></li>
							<li><Link href="/write" className="block p-2 rounded hover:italic">write.</Link></li>
							<li>
								<Link
									href={`/profile/${user?.id}`}
									className="block p-2 rounded hover:italic"
								>
									profile.
								</Link>
							</li>
							<li>
								<Button
									text="logout"
									onClick={logout}
									className="block p-2 rounded absolute bottom-10 text-left bg-gray-300 text-gray-800 hover:text-gray-900"
								/>
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
