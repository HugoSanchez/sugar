'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';
import {optimismSepolia} from 'viem/chains';

export function Providers({ children, ...props }: { children: ReactNode }) {

	const filteredProps = Object.fromEntries(
		Object.entries(props).filter(([key]) => key !== 'isSubmitting')
	);
	return (
		<PrivyProvider
			{...filteredProps}
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
			config={{
				loginMethods: ['email'],
				defaultChain: optimismSepolia,
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
