'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const SlidingMenuLayout = ({ children }: { children: React.ReactNode }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const toggleMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();  // Prevent this click from immediately closing the menu
		setIsMenuOpen(prev => !prev);
	}, []);

	const closeMenu = useCallback(() => {
		if (isMenuOpen) {
			setIsMenuOpen(false);
		}
	}, [isMenuOpen]);

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Stationary menu (always present, underneath) */}
			<div className="fixed inset-y-0 left-0 w-64 bg-white text-black z-0">
				<nav className="p-4 pt-20">
					<ul className="space-y-2">
						<li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Read</a></li>
						<li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Write</a></li>
						<li><a href="#" className="block p-2 hover:bg-gray-700 rounded">Profile</a></li>
					</ul>
				</nav>
			</div>

			{/* Sliding main content (including header) */}
			<div
				className={`fixed inset-0 bg-gray-50 transition-transform duration-300 border-l border-gray-200 ease-in-out ${
					isMenuOpen ? 'translate-x-64' : 'translate-x-0'
				}`}
				onClick={closeMenu}
			>
				{/* Header */}
				<header className={`z-10 fixed top-0 left-0 right-0 bg-gray-50 transition-shadow duration-300 h-16 ${
					isScrolled ? 'shadow-md' : ''
				}`}>
					<div className="px-6 md:px-16 h-full flex justify-between items-center">
						<Link href="/" className="text-xl font-bold text-primary ">
							<p className="font-medium">reverv.</p>
						</Link>
						<div className='flex flex-row gap-3 md:gap-6'>
							<button onClick={toggleMenu}>
								<Menu />
							</button>
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="p-4 h-[calc(100vh-64px)] overflow-auto">
					{children}
				</main>
			</div>
		</div>
	);
};

export default SlidingMenuLayout;
