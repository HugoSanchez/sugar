import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { collectPost } from '@/lib/contracts';
import { createBookmark, hasBookmarked } from '@/lib/db';
import { Bookmark, Check } from 'lucide-react';
import { UnsignedTransactionRequest, SendTransactionModalUIOptions } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';

interface CollectButtonProps {
	publicationAddress: string;
	tokenId: string;
	variant?: 'default' | 'icon';
}

interface TransactionResponse {
	status: number;
	logs: Array<{
		address: string;
		topics: string[];
		data: string;
	}>;
	transactionHash: string;
}

export default function CollectButton({ publicationAddress, tokenId, variant = 'default' }: CollectButtonProps) {
	const [isCollecting, setIsCollecting] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const { login, authenticated, sendTransaction, user } = usePrivy();
	const { user: dbUser } = useAuth();

	useEffect(() => {
		async function checkBookmarkStatus() {
			if (dbUser?.id) {
				const bookmarked = await hasBookmarked(dbUser.id, publicationAddress, tokenId);
				setIsBookmarked(bookmarked);
			}
		}

		checkBookmarkStatus();
	}, [dbUser?.id, publicationAddress, tokenId]);

	const handleCollect = async () => {
		if (isBookmarked) return;

		if (!authenticated || !user?.wallet?.address || !dbUser?.id) {
			login();
			return;
		}

		setIsCollecting(true);
		try {
			const wrappedSendTransaction = async (
				request: UnsignedTransactionRequest,
				uiConfig?: SendTransactionModalUIOptions
			): Promise<TransactionResponse> => {
				const receipt = await sendTransaction(request, uiConfig);
				return {
					status: receipt.status || 0,
					logs: receipt.logs || [],
					transactionHash: receipt.transactionHash
				};
			};

			const result = await collectPost(
				publicationAddress,
				tokenId,
				wrappedSendTransaction,
				user.wallet.address
			);

			if (result.status !== 1) {
				console.error('Transaction failed with status:', result.status);
				// TODO: Add error toast notification
			} else {
				try {
					const bookmark = await createBookmark({
						userId: dbUser.id,
						publicationAddress,
						tokenId,
						transactionHash: result.transactionHash
					});

					if (bookmark) {
						setIsBookmarked(true);
					} else {
						console.error('Failed to store bookmark in database');
					}
				} catch (error) {
					console.error('Error storing bookmark:', error);
					if (error instanceof Error) {
						console.error('Error details:', {
							name: error.name,
							message: error.message,
							stack: error.stack
						});
					}
				}
				// TODO: Add success toast notification
			}
		} catch (error: unknown) {
			console.error('Error in collect transaction:', error);
			if (error instanceof Error) {
				console.error('Error details:', {
					name: error.name,
					message: error.message,
					stack: error.stack
				});
			}
			// TODO: Add error toast notification
		} finally {
			setIsCollecting(false);
		}
	};

	if (variant === 'icon') {
		return (
			<button
				onClick={handleCollect}
				disabled={isCollecting || isBookmarked}
				className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
					isBookmarked
						? 'bg-gray-100 cursor-default'
						: 'bg-gray-100 opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed'
				}`}
				title={isBookmarked ? "Already bookmarked" : "Bookmark this post"}
			>
				{isCollecting ? (
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-gray-500"/>
				) : isBookmarked ? (
					<Check className="h-4 w-4 text-teal-500" />
				) : (
					<Bookmark className="h-4 w-4 text-gray-500" />
				)}
			</button>
		);
	}

	return (
		<button
			onClick={handleCollect}
			disabled={isCollecting || isBookmarked}
			className={`px-6 py-2 rounded-full text-sm flex items-center gap-2 ${
				isBookmarked
					? 'bg-gray-100 text-gray-700 cursor-default'
					: 'bg-teal-200 text-gray-700 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed'
			}`}
		>
			{isBookmarked ? (
				<>
					<Check className="h-4 w-4 text-teal-500" />
					bookmarked.
				</>
			) : (
				<>
					<Bookmark className="h-4 w-4" />
					{isCollecting ? "bookmarking..." : "bookmark."}
				</>
			)}
		</button>
	);
}
