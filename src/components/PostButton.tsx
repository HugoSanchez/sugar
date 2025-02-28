import React, { useState, useCallback, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';
import { Publication } from '@/lib/types';

const PostButton = ({editorContent}: {editorContent: string}) => {
	const { login, authenticated, logout, user: privyUser } = usePrivy();
	const { user: dbUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isAwaitingLogin, setIsAwaitingLogin] = useState(false);
	const [userPublication, setUserPublication] = useState<Publication | null>(null);

	useEffect(() => {
		if (authenticated && privyUser?.id) {
			checkUserPublication();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, privyUser?.id]);

	useEffect(() => {
		if (isAwaitingLogin && authenticated) {
			handlePostAfterLogin();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, isAwaitingLogin]);

	// Check if user has a publication
	const checkUserPublication = async () => {
		try {
			console.log('Checking user publications...');
			console.log('Privy ID:', privyUser?.id);
			const response = await fetch('/api/publications', {
				headers: {
					'x-privy-id': privyUser?.id || ''
				}
			});
			const data = await response.json();
			console.log('User publications:', data);

			if (data.publications && data.publications.length > 0) {
				setUserPublication(data.publications[0]);
			}
		} catch (error) {
			console.error('Error checking user publications:', error);
		}
	};

	const handleLogIn = useCallback(async () => {
		await login();
	}, [login]);

	const handleLogOut = useCallback(async () => {
		await logout();
	}, [logout]);

	const handlePost = useCallback(async () => {
		if (!authenticated) {
			setIsAwaitingLogin(true);
			await login();
			return;
		}
		handlePostAfterLogin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated, editorContent]);

	const handlePostAfterLogin = async () => {
		setIsLoading(true);
		setIsAwaitingLogin(false);

		try {
			console.log('Starting post process...');
			console.log('Editor content:', editorContent);
			console.log('DB User:', dbUser);
			console.log('Privy User:', privyUser);
			console.log('Existing publication:', userPublication);

			if (!privyUser?.id) {
				throw new Error('No authenticated user');
			}

			if (!userPublication) {
				// Create publication and post
				console.log('Creating new publication and post...');
				const response = await fetch('/api/publications', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-privy-id': privyUser.id
					},
					body: JSON.stringify({
						publication: {
							address: dbUser?.id || privyUser.id, // Prefer DB user ID, fallback to Privy ID
							standard: 'ERC721',
							network: 'ethereum'
						},
						post: {
							content: editorContent,
							tokenId: '1' // Starting with token ID 1
						}
					})
				});

				const data = await response.json();
				console.log('Publication and post created:', data);
				setUserPublication(data.publication);
			} else {
				// Create post only
				console.log('Creating new post in existing publication...');
				const response = await fetch('/api/posts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-privy-id': privyUser.id
					},
					body: JSON.stringify({
						publicationId: userPublication.id,
						publicationAddress: userPublication.address,
						content: editorContent,
						tokenId: String(Math.floor(Date.now() / 1000)) // Using timestamp as token ID for now
					})
				});

				const data = await response.json();
				console.log('Post created:', data);
			}

		} catch (error) {
			console.error('Error in post process:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='fixed bottom-16 right-0 h-16 w-screen'>
			<button
				disabled={isLoading}
				onClick={handlePost}
				className='z-20 absolute bottom-0 right-4 md:right-6 px-8 md:px-12 py-3 md:py-4 bg-gray-900 shadow-lg rounded-md hover:bg-gray-800'
			>
				{isLoading ? (
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"/>
				) : (
					<p className='text-white text-base mb-1'>post.</p>
				)}
			</button>
		</div>
	);
};

export default PostButton;
