import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToUser, unsubscribeFromUser } from '@/lib/db';

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

	// Don't render anything until Privy is ready
	if (!ready) return null;

	return (
		<Button
			onClick={handleSubscribe}
			disabled={isSubscribing}
			className={`${
				isSubscribed
				? 'bg-gray-50 font-light opacity-50 hover:bg-gray-100'
				: 'bg-teal-300 text-gray-800 hover:bg-teal-200'
		} ${className}`}
		>
		{isSubscribing
			? 'subscribing...'
			: isSubscribed
			? 'Unsubscribe'
			: 'Subscribe'
		}
		</Button>
	);
}
