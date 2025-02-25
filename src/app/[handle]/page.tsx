'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUserByUsername } from '@/lib/db';
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

export default function ProfilePage() {
	const { handle } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadUserData() {
			if (!handle) return;

			try {
				const userData = await getUserByUsername(decodeURIComponent(handle as string));
				setUser(userData);
				console.log('userData', userData);
			} catch (error) {
				console.error('Error loading user:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadUserData();
	}, [handle]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center px-4 w-full h-full">
				<div className="text-center">
					<h1 className="text-2xl text-gray-700 mb-2">User not found</h1>
					<p className="text-gray-600">The user @{decodeURIComponent(handle as string)} does not exist.</p>
				</div>
			</div>
		);
	}

	const sections = [
		{
			title: 'About',
			content: (
				<p className="text-gray-700 text-sm leading-relaxed">
					{user.description || 'No description provided.'}
				</p>
			)
		},
		{
			title: 'Writings',
			content: (
				<div className="space-y-3">
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900 hover:underline">
            ↗ On building a blockchain
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On crypto startup ideas for 2024
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On crypto startup ideas for 2023
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On the future of pensions in Canada
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On Uber&apos;s surge pricing
					</a>
					<a href="#" className="text-xs block text-gray-500 hover:text-gray-700">
            View all
					</a>
				</div>
			)
		},
		{
			title: 'Reading',
			content: (
				<div className="space-y-3">
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              The Power Broker ↗
						</a>
						<span className="text-gray-500">by Robert A. Caro</span>
						<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">READING</span>
					</div>
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              A Gentleman in Moscow ↗
						</a>
						<span className="text-gray-500">by Amor Towles</span>
						<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">READING</span>
					</div>
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              The Housemaid ↗
						</a>
						<span className="text-gray-500">by Freida McFadden</span>
						<span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-500">DONE</span>
					</div>
				</div>
			)
		}
	];

	return (
		<div className="w-full px-4 md:px-72 py-24">
			{/* Profile Header - Always side by side */}
			<div className="mb-6 flex flex-row">
				<div className='flex flex-col w-2/4'>
					<h1 className="text-lg font-medium leading-tight">{user.name}</h1>
					<h3 className="text-sm font-light text-gray-700">@{user.username}</h3>
					{user.walletAddress && (
						<p className="text-sm text-gray-400">
							{user.walletAddress.slice(0, 5)}..{user.walletAddress.slice(-4)}
						</p>
					)}
				</div>
				<div className='flex w-2/4 justify-end items-center'>
					<Button className="bg-teal-100 hover:bg-teal-200">
						Subscribe
					</Button>
				</div>
			</div>

			{/* Sections */}
			<div className="space-y-12 md:space-y-16">
				{sections.map((section) => (
					<section key={section.title} className="border-t border-gray-300 pt-8">
						{/* Mobile: Stack vertically */}
						<div className="block md:hidden">
							<p className="text-gray-800 text-sm font-medium mb-4">{section.title}</p>
							<div>{section.content}</div>
						</div>

						{/* Desktop: Grid layout */}
						<div className="hidden md:grid md:grid-cols-4 md:gap-8">
							<p className="text-gray-800 text-sm font-medium">{section.title}</p>
							<div className="col-span-3">
								{section.content}
							</div>
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

