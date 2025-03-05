'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserByUsername, getPost, getUserPublications } from '@/lib/db';
import { Post, User } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { RevervEditor } from '@/components/Editor';

export default function PostPage() {
	const params = useParams();
	const handle = params.handle as string;
	const tokenId = params.postId as string;
	const [post, setPost] = useState<Post | null>(null);
	const [author, setAuthor] = useState<Partial<User> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadPost() {
			if (!handle || !tokenId) {
				setError('Invalid URL');
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				// First get the user by handle
				const userData = await getUserByUsername(decodeURIComponent(handle));
				if (!userData || !userData.id) {
					setError('User not found');
					return;
				}
				setAuthor(userData);

				// Then get the post by token ID
				const postData = await getPost(tokenId);
				if (!postData) {
					setError('Post not found');
					return;
				}

				// Verify the post belongs to the user's publication
				const userPublications = await getUserPublications(userData.id);
				const publicationAddresses = userPublications.map(pub => pub.address.toLowerCase());
				if (!publicationAddresses.includes(postData.publicationAddress.toLowerCase())) {
					setError('Post not found');
					return;
				}

				setPost(postData);
			} catch (err) {
				console.error('Error loading post:', err);
				setError('Failed to load post');
			} finally {
				setIsLoading(false);
			}
		}

		loadPost();
	}, [handle, tokenId]);

	if (isLoading) {
		return <Spinner />;
	}

	if (error || !post || !author) {
		return (
			<div className="flex items-center justify-center px-4 w-full h-full">
				<div className="text-center">
					<h1 className="text-2xl text-gray-700 mb-2">Error</h1>
					<p className="text-gray-600">{error || 'Something went wrong'}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col py-10 md:py-32 px-2 md:px-80">
			{/* Author info */}
			<div className="mb-8">
				<h1 className="text-lg font-medium">{author.name}</h1>
				<p className="text-sm text-gray-600">@{author.username}</p>
			</div>

			{/* Post content */}
			<RevervEditor
				initialContent={post.content}
				readOnly={true}
				onEditorChange={() => {}}
			/>
		</div>
	);
}
