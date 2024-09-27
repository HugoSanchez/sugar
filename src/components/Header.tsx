"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header({ children }: { children: React.ReactNode }) {
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


	return (
		<header className={`fixed top-0 left-0 right-0 bg-gray-50 z-10 transition-shadow duration-300 h-16 ${
			isScrolled ? 'shadow-md' : ''
		}`}>
			<div className="px-6 md:px-16 h-full flex justify-between items-center">
				<Link href="/" className="text-xl font-bold text-primary ">
					<p className="font-medium">reverv.</p>
				</Link>
				<div className='flex flex-row gap-3 md:gap-6'>
					{
						children
					}
				</div>
			</div>
		</header>
	)
}
