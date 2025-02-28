/**
 * PostButton Component
 *
 * This component handles the creation of new publications and posts on the blockchain.
 * It manages authentication state, wallet connections, and blockchain interactions.
 */
import React, { useState, useCallback, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';
import { useSigner } from '@/hooks/useSigner';
import { Publication } from '@/lib/types';
import { createPublicationAndFirstPost } from '@/lib/contracts';
import { getUserPublications } from '@/lib/db';
import { MINIMAL_FACTORY_ADDRESS } from '@/constants';

interface PostButtonProps {
	editorContent: string;  // Content to be posted
}

const PostButton = ({ editorContent }: PostButtonProps) => {
	// Authentication and wallet states
	const { login, authenticated } = usePrivy();                           // Privy authentication
	const { user: dbUser, ready: authReady } = useAuth();                 // Database user state
	const { signer, isLoading: isBlockchainLoading } = useSigner();      // Blockchain signer

	// Component state
	const [isLoading, setIsLoading] = useState(false);                    // Loading state for post creation
	const [userPublication, setUserPublication] = useState<Publication | null>(null);  // User's existing publication

	/**
	 * Effect: Check for user's existing publication
	 * Runs when authentication is ready and database user is available
	 */
	useEffect(() => {
		async function checkPublication() {
			if (!dbUser?.id) return;

			const publications = await getUserPublications(dbUser.id);
			setUserPublication(publications[0] || null);
		}

		if (authReady && dbUser?.id) {
			checkPublication();
		}
	}, [authReady, dbUser?.id]);

	/**
	 * Handles the post creation process
	 * 1. Ensures user is authenticated
	 * 2. Verifies database user exists
	 * 3. Confirms signer is available
	 * 4. Creates new publication if needed
	 */
	const handlePost = useCallback(async () => {
		// Handle authentication
		if (!authenticated) {
			await login();
			return;
		}

		// Check for database user
		if (!dbUser?.id) {
			console.log('Waiting for database user to be ready...');
			return;
		}

		// Verify wallet/signer availability
		if (!signer) {
			console.log('Waiting for wallet to be ready...');
			return;
		}

		setIsLoading(true);

		try {
			// Create new publication if user doesn't have one
			if (!userPublication) {
				console.log('Creating new publication...');
				const result = await createPublicationAndFirstPost(
					'Reverv Publication',
					'',
					editorContent,
					false,
					MINIMAL_FACTORY_ADDRESS,
					signer
				);

				console.log('Publication creation result:', result);
			}
		} catch (error) {
			console.error('Error in post process:', error);
		} finally {
			setIsLoading(false);
		}
	}, [authenticated, login, dbUser?.id, signer, userPublication, editorContent]);

	// Render post button with loading state
	return (
		<div className='fixed bottom-16 right-0 h-16 w-screen'>
			<button
				disabled={isLoading || isBlockchainLoading || !authReady}
				onClick={handlePost}
				className='z-20 absolute bottom-0 right-4 md:right-6 px-8 md:px-12 py-3 md:py-4 bg-gray-900 shadow-lg rounded-md hover:bg-gray-800'
			>
				{isLoading || isBlockchainLoading ? (
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"/>
				) : (
					<p className='text-white text-base mb-1'>post.</p>
				)}
			</button>
		</div>
	);
};

export default PostButton;
