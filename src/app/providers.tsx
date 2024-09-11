'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
			config={{
				loginMethods: ['email', 'wallet'],
				appearance: {
					theme: 'light',
					accentColor: '#676FFF',
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
