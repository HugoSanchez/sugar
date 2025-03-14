/**
 * PostButton Component
 *
 * This component handles the creation of new publications and posts on the blockchain.
 * It manages authentication state, wallet connections, and blockchain interactions.
 */
import React, { useState, useCallback, useEffect } from 'react';
import { usePrivy, useSendTransaction } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';
import { Publication } from '@/lib/types';
import { createPublication, createPost } from '@/lib/contracts';
import { getUserPublications, createPublication as createPublicationInDb, createPost as createPostInDb } from '@/lib/db';
import { MINIMAL_FACTORY_ADDRESS } from '@/constants';
import { useRouter } from 'next/navigation';

interface PostButtonProps {
	editorContent: string;  // Content to be posted
}

/**
 * Extracts the title from the editor content if it exists
 * @param content JSON string of editor content
 * @returns The title text or null if no title found
 */
function extractTitle(content: string): string | null {
	try {
		const parsedContent = JSON.parse(content);
		const titleNode = parsedContent.content.find((node: any) =>
			node.type === 'heading' && node.attrs?.level === 1
		);

		if (titleNode && titleNode.content && titleNode.content[0]) {
			return titleNode.content[0].text || null;
		}
		return null;
	} catch (error) {
		console.error('Error extracting title:', error);
		return null;
	}
}

const PostButton = ({ editorContent }: PostButtonProps) => {
	// Authentication and transaction states
	const { login, authenticated, user: privyUser } = usePrivy();         // Privy authentication
	const { user: dbUser, ready: authReady } = useAuth();                 // Database user state
	const { sendTransaction } = useSendTransaction();                      // Privy transaction sender
	const router = useRouter();

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
	 * Stores a post in the database
	 */
	const storePost = async (
		publicationAddress: string,
		transactionHash: string,
		tokenId: string,
		publicationId: string,
		contentUri: string,
		content: string,
		title: string | null
	) => {
		if (!publicationId) {
			throw new Error('Publication ID is required to store post');
		}

		const post = await createPostInDb({
			publicationId,
			publicationAddress,
			content_uri: contentUri,
			content,
			title,
			tokenId,
			transactionHash
		});

		if (!post) {
			throw new Error('Failed to store post in database');
		}

		return post;
	};

	/**
	 * Handles the post creation process
	 */
	const handlePost = useCallback(async () => {
		// Handle authentication
		if (!authenticated) {
			await login();
			return;
		}

		// Check for database user and wallet address
		if (!dbUser?.id || !privyUser?.wallet?.address) {
			console.log('Waiting for database user and wallet to be ready...');
			return;
		}

		setIsLoading(true);

		try {
			let result;
			let storedPost;
			const extractedTitle = extractTitle(editorContent);

			// Create new publication if user doesn't have one
			if (!userPublication) {
				console.log('Creating new publication...');

				// Create the publication on-chain
				result = await createPublication(
					editorContent,
					MINIMAL_FACTORY_ADDRESS,
					sendTransaction
				);

				console.log('Publication created:', result);

				// Handle any errors from the contract interaction
				if (result.error || !result.publicationAddress || !result.transactionHash || !result.tokenId || !result.contentUri) {
					throw new Error(result.error || 'Failed to create publication');
				}

				// Store the publication in the database
				const newPublication = await createPublicationInDb({
					userId: dbUser.id,
					address: result.publicationAddress,
					standard: 'ERC1155',
					network: 'optimism-sepolia'
				});

				if (!newPublication) {
					throw new Error('Failed to store publication in database');
				}

				// Update local state
				setUserPublication(newPublication);
				console.log('Publication stored in database:', newPublication);

				// Store the first post with the new publication ID
				storedPost = await storePost(
					result.publicationAddress,
					result.transactionHash,
					result.tokenId,
					newPublication.id,
					result.contentUri,
					editorContent,
					extractedTitle
				);
			} else {
				console.log('Creating new post in existing publication...');

				// Create post in existing publication
				result = await createPost(
					editorContent,
					userPublication.address,
					sendTransaction,
					privyUser.wallet.address
				);

				console.log('Post created:', result);

				// Handle any errors from the contract interaction
				if (result.error || !result.transactionHash || !result.tokenId || !result.contentUri) {
					throw new Error(result.error || 'Failed to create post');
				}

				// Store the post in the database with the existing publication ID
				storedPost = await storePost(
					userPublication.address,
					result.transactionHash,
					result.tokenId,
					userPublication.id,
					result.contentUri,
					editorContent,
					extractedTitle
				);
			}

			console.log('Post created successfully');

			// Redirect to the post page using the user's handle and tokenId
			if (storedPost && dbUser.username) {
				router.push(`/${dbUser.username}/${result.tokenId}`);
			}
		} catch (error) {
			console.error('Error in post process:', error);
		} finally {
			setIsLoading(false);
		}
	}, [authenticated, login, dbUser?.id, dbUser?.username, userPublication, privyUser?.wallet?.address, editorContent, sendTransaction, router]);

	// Render post button with loading state
	return (
		<div className='fixed bottom-16 right-0 h-16 w-screen'>
			<button
				disabled={isLoading || !authReady}
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
