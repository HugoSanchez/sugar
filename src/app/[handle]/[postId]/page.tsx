'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserByUsername, getPost, getUserPublications } from '@/lib/db';
import { Post, User } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { RevervEditor } from '@/components/Editor';
import { Copy, Check } from 'lucide-react';
import { publicActions } from 'viem';

interface ParsedContent {
	header: {
		title: string;
		subtitle: string | null;
	} | null;
	body: any;
}

export default function PostPage() {
	const params = useParams();
	const handle = params.handle as string;
	const tokenId = params.postId as string;
	const [post, setPost] = useState<Post | null>(null);
	const [author, setAuthor] = useState<Partial<User> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [parsedContent, setParsedContent] = useState<ParsedContent>({ header: null, body: null });
	const [hasCopied, setHasCopied] = useState(false);

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

				// Parse content to separate header (title + subtitle) and body
				try {
					const content = JSON.parse(postData.content);
					const titleIndex = content.content.findIndex((node: any) =>
						node.type === 'heading' && node.attrs?.level === 1
					);

					if (titleIndex !== -1) {
						// Extract title
						const titleContent = {
							type: 'doc',
							content: [content.content[titleIndex]]
						};

						// Look for subtitle
						const remainingAfterTitle = content.content.slice(titleIndex + 1);
						const subtitleIndex = remainingAfterTitle.findIndex((node: any) =>
							node.type === 'heading' && node.attrs?.level === 2
						);

						// Extract subtitle if it exists
						const subtitleContent = subtitleIndex !== -1 ? {
							type: 'doc',
							content: [remainingAfterTitle[subtitleIndex]]
						} : null;

						// Get the body content starting after the subtitle (or title if no subtitle)
						let bodyContent = subtitleIndex !== -1
							? remainingAfterTitle.slice(subtitleIndex + 1)
							: remainingAfterTitle;

						// Remove all empty paragraphs at the start until we find content
						while (bodyContent.length > 0 &&
							bodyContent[0].type === 'paragraph' &&
							(!bodyContent[0].content || bodyContent[0].content.length === 0)) {
							bodyContent = bodyContent.slice(1);
						}

						setParsedContent({
							header: {
								title: JSON.stringify(titleContent),
								subtitle: subtitleContent ? JSON.stringify(subtitleContent) : null
							},
							body: JSON.stringify({
								type: 'doc',
								content: bodyContent
							})
						});
					} else {
						// No title, use full content as body
						setParsedContent({
							header: null,
							body: postData.content
						});
					}
				} catch (e) {
					console.error('Error parsing content:', e);
					setParsedContent({
						header: null,
						body: postData.content
					});
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

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setHasCopied(true);
			setTimeout(() => {
				setHasCopied(false);
			}, 3000);
		} catch (err) {
			console.error('Failed to copy URL:', err);
		}
	};

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
		<div className="flex flex-col mt-16 py-10 md:py-32 px-2 md:px-80">
			{/* Title */}
			{parsedContent.header && (
				<div>
					<div className="mb-3">
						<RevervEditor
							initialContent={parsedContent.header.title}
							readOnly={true}
							onEditorChange={() => {}}
						/>
					</div>

					{/* Subtitle */}
					{parsedContent.header.subtitle && (
						<div className="mb-3">
							<RevervEditor
								initialContent={parsedContent.header.subtitle}
								readOnly={true}
								onEditorChange={() => {}}
							/>
						</div>
					)}
				</div>
			)}

			{/* Author info */}
			<div className="my-4 pr-4 md:pr-8 flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<p className="text-base font-medium text-gray-800">{author.name}</p>
					<p className="text-sm text-gray-600">@{author.username}</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={handleShare}
						className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center bg-gray-100 opacity-90'
						}`}
						title="Copy link to clipboard"
					>
						{hasCopied ? (
							<Check className="h-4 w-4 text-gray-500" />
						) : (
							<Copy className="h-4 w-4 text-gray-500" />
						)}
					</button>
					<button
						className="px-4 py-2 rounded-full text-sm text-gray-600 bg-teal-200 hover:bg-teal-200"
					>
						Collect
					</button>
				</div>
			</div>

			{/* Body content */}
			<div className="mt-2">
				<RevervEditor
					initialContent={parsedContent.body}
					readOnly={true}
					onEditorChange={() => {}}
				/>
			</div>

			{/* Footer */}
			<div className="mt-8">
				<p className="text-xs italic text-gray-600">
					Posted to Ethereum on {new Date(post.createdAt).toLocaleDateString()}
				</p>
				<p className="text-xs italic text-gray-600">Transaction index: {post?.transactionHash?.slice(0, 8)}</p>
				<p className="text-xs italic text-gray-600">User address: {author.walletAddress?.slice(0,8)}</p>
			</div>
		</div>
	);
}
