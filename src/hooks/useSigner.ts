/**
 * Custom hook to manage Ethereum signer state and initialization
 * This hook handles the setup and management of an Ethereum signer using Privy's embedded wallet
 */
import { useState, useEffect } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

export function useSigner() {
	// Get wallets from Privy's wallet management
	const { wallets } = useWallets();
	// Get authentication state from Privy
	const { authenticated } = usePrivy();

	// State management for Ethereum interaction
	const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);  // Web3 provider instance
	const [signer, setSigner] = useState<ethers.Signer | null>(null);                     // Ethereum signer for transactions
	const [address, setAddress] = useState<string | null>(null);                          // Connected wallet address
	const [chainId, setChainId] = useState<number | null>(null);                         // Current blockchain network ID
	const [isLoading, setIsLoading] = useState(false);                                   // Loading state indicator
	const [error, setError] = useState<string | null>(null);                             // Error state management

	useEffect(() => {
		/**
		 * Initializes the Ethereum signer and related states
		 * This function handles the complete setup of the Ethereum environment
		 */
		async function setupSigner() {
			try {
				setIsLoading(true);
				setError(null);

				// Find Privy's embedded wallet from available wallets
				const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

				// Guard: Check if embedded wallet exists
				if (!embeddedWallet) {
					setError('No embedded wallet found');
					return;
				}

				// Guard: Check if wallet is properly initialized
				if (!embeddedWallet.address) {
					setError('Wallet not fully initialized');
					return;
				}

				// Initialize provider
				const ethProvider = await embeddedWallet.getEthereumProvider();
				const ethersProvider = new ethers.providers.Web3Provider(ethProvider);
				setProvider(ethersProvider);

				// Get signer instance for transaction signing
				const ethersSigner = ethersProvider.getSigner();
				console.log('ethersSigner:', ethersSigner);
				setSigner(ethersSigner);

				// Get and store the wallet address
				const walletAddress = await ethersSigner.getAddress();
				setAddress(walletAddress);

				// Get and store the network chain ID
				const network = await ethersProvider.getNetwork();
				setChainId(network.chainId);

			} catch (err) {
				console.error('Error setting up signer:', err);
				setError(err instanceof Error ? err.message : 'Unknown error occurred');
			} finally {
				setIsLoading(false);
			}
		}

		// Only initialize signer if user is authenticated and wallets are available
		if (authenticated && wallets.length > 0) {
			setupSigner();
		} else {
			// Reset all states if user is not authenticated
			setProvider(null);
			setSigner(null);
			setAddress(null);
			setChainId(null);
			setError(null);
			setIsLoading(false);
		}
	}, [authenticated, wallets]); // Re-run when authentication state or wallets change

	// Return all necessary states and instances for Ethereum interaction
	return {
		provider,    // Web3 provider for reading blockchain state
		signer,      // Signer for sending transactions
		address,     // Connected wallet address
		chainId,     // Current network chain ID
		isLoading,   // Loading state
		error        // Error state
	};
}
