'use client';

import { useParams } from 'next/navigation';
import {
	getUserByUsername,
	isSubscribedToUser,
	getPosts,
	getUserPublications,
	getUserBookmarks,
	getPost
} from '@/lib/db';
import { useState, useEffect } from 'react';
import { User, Post } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { SubscribeButton } from '@/components/SubscribeButton';
import Link from 'next/link';

interface PostWithTitle {
	post: Post;
	displayText: string;
}

interface ContentNode {
	type: string;
	attrs?: {
		level?: number;
	};
	content?: Array<{
		text?: string;
	}>;
}

const ITEMS_LIMIT = 6;

export default function ProfilePage() {
	const { handle } = useParams();
	const { user: currentUser } = useAuth();
	const [user, setUser] = useState<Partial<User> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [userPosts, setUserPosts] = useState<PostWithTitle[]>([]);
	const [bookmarks, setBookmarks] = useState<PostWithTitle[]>([]);
	const [expandedSections, setExpandedSections] = useState<{
		writings: boolean;
		reading: boolean;
	}>({
		writings: false,
		reading: false
	});

	const extractDisplayText = (post: Post): string => {
		try {
			const content = JSON.parse(post.content);
			// Look for title (h1)
			const titleNode = content.content.find((node: ContentNode) =>
				node.type === 'heading' && node.attrs?.level === 1
			);

			if (titleNode && titleNode.content && titleNode.content[0]) {
				return titleNode.content[0].text || 'Untitled';
			}

			// If no title, get first 60 characters of content
			const firstTextNode = content.content.find((node: ContentNode) =>
				node.type === 'paragraph' && node.content && node.content[0]
			);

			if (firstTextNode && firstTextNode.content) {
				const text = firstTextNode.content[0].text || '';
				return text.length > 60 ? text.substring(0, 60) + '...' : text;
			}

			return 'Untitled';
		} catch (error) {
			console.error('Error parsing content:', error);
			return 'Untitled';
		}
	};

	const toggleSection = (section: 'writings' | 'reading') => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	useEffect(() => {
		async function loadUserData() {
			if (!handle) return;

			try {
				// Fetch the profile data for the username in the URL
				const userData = await getUserByUsername(decodeURIComponent(handle as string));
				setUser(userData);

				if (userData?.id) {
					// Get user's publications
					const publications = await getUserPublications(userData.id);

					// Get all posts for each publication
					const allPosts: Post[] = [];
					for (const pub of publications) {
						const posts = await getPosts(pub.id);
						allPosts.push(...posts);
					}

					// Sort posts by creation date and add display text
					const postsWithTitles = allPosts
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
						.map(post => ({
							post,
							displayText: extractDisplayText(post)
						}));
					setUserPosts(postsWithTitles);

					// Get user's bookmarks
					const userBookmarks = await getUserBookmarks(userData.id);
					const bookmarkedPosts: PostWithTitle[] = [];

					// Fetch full post data for each bookmark
					for (const bookmark of userBookmarks) {
						const post = await getPost(bookmark.tokenId, bookmark.publicationAddress);
						if (post) {
							bookmarkedPosts.push({
								post,
								displayText: extractDisplayText(post)
							});
						}
					}
					setBookmarks(bookmarkedPosts);

					// Check subscription status if we have a logged-in user
					if (currentUser?.id) {
						const subscribed = await isSubscribedToUser(currentUser.id, userData.id);
						setIsSubscribed(subscribed);
					}
				}
			} catch (error) {
				console.error('Error loading user:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadUserData();
	}, [handle, currentUser?.id]);

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
					{(expandedSections.writings ? userPosts : userPosts.slice(0, ITEMS_LIMIT)).map(({ post, displayText }) => (
						<Link
							key={post.id}
							href={`/${user.username}/${post.tokenId}`}
							className="text-sm block text-gray-700 font-light hover:text-gray-900 hover:underline"
						>
							↗ {displayText}
						</Link>
					))}
					{userPosts.length > ITEMS_LIMIT && (
						<button
							onClick={() => toggleSection('writings')}
							className="text-xs block text-gray-500 hover:text-gray-700 mt-4"
						>
							{expandedSections.writings ? 'Show less' : `View all (${userPosts.length})`}
						</button>
					)}
				</div>
			)
		},
		{
			title: 'Reading',
			content: (
				<div className="space-y-3">
					{(expandedSections.reading ? bookmarks : bookmarks.slice(0, ITEMS_LIMIT)).map(({ post, displayText }) => (
						<div key={post.id} className="flex items-center space-x-2">
							<Link
								href={`/${user.username}/${post.tokenId}`}
								className="text-gray-700 hover:text-gray-900"
							>
								{displayText} ↗
							</Link>
						</div>
					))}
					{bookmarks.length > ITEMS_LIMIT && (
						<button
							onClick={() => toggleSection('reading')}
							className="text-xs block text-gray-500 hover:text-gray-700 mt-4"
						>
							{expandedSections.reading ? 'Show less' : `View all (${bookmarks.length})`}
						</button>
					)}
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
					{user?.id && (
						<SubscribeButton
							publisherId={user.id}
							isSubscribed={isSubscribed}
							onSubscriptionChange={setIsSubscribed}
						/>
					)}
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

