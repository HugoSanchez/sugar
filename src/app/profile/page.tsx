'use client'

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getUserByUsername, updateUser, getUserByPrivyId } from '@/lib/db';

export default function Profile() {
	const { user } = useAuth();
	const router = useRouter();
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [usernameError, setUsernameError] = useState('');

	useEffect(() => {
		async function loadUserData() {
			if (!user?.id) return;

			try {
				const dbUser = await getUserByPrivyId(user.id);
				if (dbUser) {
					setName(dbUser.name || '');
					setUsername(dbUser.username || '');
					setDescription(dbUser.description || '');
				}
			} catch (error) {
				console.error('Error loading user data:', error);
			}
		}

		loadUserData();
	}, [user?.id]);

	const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase().trim();
		setUsername(value);

		if (!value) {
			setUsernameError('Username is required');
			return;
		}

		// Check if username is valid format
		if (!/^[a-z0-9_-]+$/.test(value)) {
			setUsernameError('Username can only contain letters, numbers, underscores, and hyphens');
			return;
		}

		try {
			const existingUser = await getUserByUsername(value);
			if (existingUser) {
				setUsernameError('Username is already taken');
			} else {
				setUsernameError('');
			}
		} catch (error) {
			console.error('Error checking username:', error);
			setUsernameError('Error checking username availability');
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!user?.id) {
				throw new Error('User not authenticated');
			}

			// Final username check before submission
			const existingUser = await getUserByUsername(username);
			if (existingUser) {
				setUsernameError('Username is already taken');
				return;
			}

			// Get the user's database record using their Privy ID
			const dbUser = await getUserByPrivyId(user.id);
			if (!dbUser) {
				throw new Error('User not found in database');
			}

			await updateUser(dbUser.id, {
				username,
				name,
				description
			});

			router.push(`/${username}`);
		} catch (error) {
			console.error('Error updating profile:', error);
			alert('Failed to update profile. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="py-16 px-2 md:px-72 space-y-8">
				<div className='pb-4'>
					<h2 className='text-3xl font-medium text-gray-700'>Your</h2>
					<h2 className='text-3xl font-medium text-gray-700'>profile<span className='text-teal-200'>.</span></h2>

				</div>

				<div>
					<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
					<Input
						id="name"
						type="text"
						value={name}
						required
						onChange={(e) => setName(e.target.value)}
						onInvalid={(e) => e.preventDefault()}
						className='autofill:bg-white transition-none text-gray-700'
					/>
				</div>

				<div>
					<label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username</label>
					<Input
						id="username"
						type="text"
						value={username}
						required
						onChange={handleUsernameChange}
						className={`autofill:bg-white transition-none text-gray-700 ${
							usernameError ? 'border-red-500' : ''
						}`}
					/>
					{usernameError && (
						<p className="text-red-500 text-sm mt-1">{usernameError}</p>
					)}
					<p className='text-xs text-gray-500 my-2'>reverv.xyz/{username}</p>
				</div>

				<div>
					<label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
					<Textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='autofill:bg-white transition-none text-gray-600 font-light'
						rows={3}
					/>
				</div>
				<div className=''>
					<Button
						type="submit"
						disabled={isLoading || !name}
						className='h-12 w-full bg-teal-200 hover:opacity-90'
					>
						{isLoading ? 'Saving...' : 'Save'}
					</Button>
				</div>

			</form>
		</div>
	);
}
