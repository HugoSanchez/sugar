import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToUser, unsubscribeFromUser, isSubscribedToUser } from '@/lib/db';
import { Check } from 'lucide-react';

interface SubscribeButtonProps {
	publisherId: string;
	isSubscribed: boolean;
	onSubscriptionChange?: (isSubscribed: boolean) => void;
	className?: string;
}

export function SubscribeButton({
	publisherId,
	isSubscribed: initialIsSubscribed,
	onSubscriptionChange,
	className = ''
}: SubscribeButtonProps) {
	const { user: currentUser, login, ready } = useAuth();
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
	const [isCheckingStatus, setIsCheckingStatus] = useState(true);

	// Check subscription status when component mounts or when user changes
	useEffect(() => {
		async function checkSubscriptionStatus() {
			if (!currentUser?.id || !publisherId) return;

			try {
				const subscriptionStatus = await isSubscribedToUser(currentUser.id, publisherId);
				setIsSubscribed(subscriptionStatus);
				onSubscriptionChange?.(subscriptionStatus);
			} catch (error) {
				console.error('Error checking subscription status:', error);
			} finally {
				setIsCheckingStatus(false);
			}
		}

		checkSubscriptionStatus();
	}, [currentUser?.id, publisherId, onSubscriptionChange]);

	const handleSubscribe = async () => {
		// If user is not logged in, trigger login flow
		if (!currentUser?.id) {
			await login();
			return;
		}

		setIsSubscribing(true);

		try {
			// Call the appropriate function based on current subscription status
			const success = isSubscribed
				? await unsubscribeFromUser(currentUser.id, publisherId)
				: await subscribeToUser(currentUser.id, publisherId);

			// If the API call was successful, update the UI
			if (success) {
				setIsSubscribed(!isSubscribed);
				onSubscriptionChange?.(!isSubscribed);
			}
		} catch (error) {
			console.error('Error updating subscription:', error);
		} finally {
			setIsSubscribing(false);
		}
	};

	// Don't render anything until Privy is ready and we've checked subscription status
	if (!ready || isCheckingStatus) return null;

	return (
		<Button
			onClick={handleSubscribe}
			disabled={isSubscribing}
			className={`${
				isSubscribed
				? 'bg-gray-100 font-light hover:bg-gray-100'
				: 'bg-teal-300 text-gray-800 hover:bg-teal-200'
		} ${className} flex items-center gap-2`}
		>
		{isSubscribing
			? '...'
			: isSubscribed
			? (
				<>
					Subscribed
					<Check className="h-5 w-5 text-teal-500" />
				</>
			)
			: 'Subscribe'
		}
		</Button>
	);
}
