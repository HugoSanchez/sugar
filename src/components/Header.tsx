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
	const { authenticated, login } = useAuth();

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

	return (
		<header className={`fixed top-0 left-0 right-0 bg-gray-50 z-10 transition-shadow duration-300 h-16 ${
			isScrolled ? 'shadow-md' : ''
		}`}>
			<div className="px-6 md:px-16 h-full flex justify-between items-center">
				<Link href="/" className="text-xl font-bold text-primary">
					<p className="font-medium">reverv.</p>
				</Link>
				<div className='flex flex-row gap-3 md:gap-6 items-center'>
					{authenticated ? (
						<button onClick={onMenuClick} className="hover:opacity-80">
							<Menu />
						</button>
					) : (
						<button
							onClick={login}
							className="font-medium text-gray-700 hover:text-gray-900"
						>
							login.
						</button>
					)}
				</div>
			</div>
		</header>
	)
}
