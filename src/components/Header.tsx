"use client"

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

interface HeaderProps {
	onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
	const [isScrolled, setIsScrolled] = useState(false)
	const { authenticated, login, ready, user } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		// Log the first wallet's address if available
		console.log('user', user);

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [user])

	return (
		<header className={`fixed top-0 left-0 right-0 bg-gray-50 z-10 transition-shadow duration-300 h-16 ${
			isScrolled ? 'shadow-md' : ''
		}`}>
			<div className="px-6 md:px-16 h-full flex justify-between items-center">
				<Link href="/" className="text-primary">
					<p className="font-medium text-base">reverv<span className='text-lg text-teal-400'>.</span></p>
				</Link>
				<div className='flex flex-row '>
					{ready && (
						authenticated ? (
							<button onClick={onMenuClick} className="hover:opacity-80">
								<Menu />
							</button>
						) : (
							<button onClick={login} className='text-end text-sm text-gray-800 hover:text-gray-900'>
								<p className='text-sm'>login<span className='text-lg text-teal-400'>.</span></p>
							</button>
						)
					)}
				</div>
			</div>
		</header>
	)
}
