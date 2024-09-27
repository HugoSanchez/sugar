'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SimpleEditor } from '../../components/Editor'

export default function Write() {
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
		<div className='flex flex-col py-20 md:py-32 px-8 md:px-80 '>
			<header className={`fixed top-0 left-0 right-0 bg-gray-50 z-10 transition-shadow duration-300 h-20 ${
				isScrolled ? 'shadow-md' : ''
			}`}>
				<div className="mx-auto px-6 md:px-16 h-full flex justify-between items-center">
					<Link href="/" className="text-xl font-bold text-primary ">
						<p className="font-medium">reverv.</p>
					</Link>
					<div className=''>
						<p className="text-base text-black cursor-pointer">post.</p>
					</div>
				</div>
			</header>
			<SimpleEditor />
		</div>
	)
}
