import { ethers } from 'ethers';
import CollectionFactoryABI from '../artifacts/contracts/MinimalFactory.sol/CollectionFactory.json';
import MinimalCollectionABI from '../artifacts/contracts/MinimalCollection.sol/MinimalCollection.json';
import { UnsignedTransactionRequest, SendTransactionModalUIOptions } from '@privy-io/react-auth';
import { MINIMAL_MARKET_ADDRESS } from '@/constants';

interface TransactionLog {
	address: string;
	topics: string[];
	data: string;
}

interface TransactionResponse {
	status: number;
	logs: TransactionLog[];
	transactionHash: string;
}

// Contract instantiation functions (for reading only)
export function getFactoryContract(provider: ethers.providers.Provider, address: string) {
	return new ethers.Contract(
		address,
		CollectionFactoryABI.abi,
		provider
	);
}

export function getPublicationContract(provider: ethers.providers.Provider, address: string) {
	return new ethers.Contract(
		address,
		MinimalCollectionABI.abi,
		provider
	);
}

interface TransactionResult {
  error?: string;
  transactionHash?: string;
  publicationAddress?: string;
  tokenId?: string;
  contentUri?: string;
  isGated?: boolean;
}

/**
 * Parse the NewPostCreated event from transaction logs
 * @param logs Transaction logs to parse
 * @returns Object containing tokenId and metadataURI
 */
function parsePostCreatedEvent(logs: TransactionLog[]) {
	const iface = new ethers.utils.Interface(MinimalCollectionABI.abi);
	const eventSignature = iface.getEventTopic('NewPostCreated');

	// Find the event log
	const postLog = logs.find(log => log.topics[0] === eventSignature);
	if (!postLog || !postLog.topics[1]) {
		throw new Error('Could not find NewPostCreated event in logs');
	}

	// Decode the non-indexed parameters from the data field
	const decodedData = iface.decodeEventLog(
		'NewPostCreated',
		postLog.data,
		postLog.topics
	);

	return {
		tokenId: ethers.BigNumber.from(decodedData.id).toString(),
		metadataURI: decodedData.metadataURI,
		isGated: decodedData.isGated
	};
}

/**
 * Creates a new publication and its first post using the factory contract
 * @param content The content of the first post
 * @param factoryAddress The address of the factory contract
 * @param sendTransaction The Privy sendTransaction function
 * @returns Object containing the transaction result or error
 */
export async function createPublication(
	content: string,
	factoryAddress: string,
	sendTransaction: (request: UnsignedTransactionRequest, uiConfig?: SendTransactionModalUIOptions) => Promise<TransactionResponse>
): Promise<TransactionResult> {
	try {
		// Create the transaction request
		// This is to get the transaction object in a format that Privy can use
		// Including passing the function call as bytecode.
		const txRequest = createPublicationAndFirstPostTransaction(
			'Reverv. Publication',
			'',
			content,
			false,
			factoryAddress
		);

		// Configure the UI options for the transaction
		// This manages the information that privy will display to the user
		const uiConfig: SendTransactionModalUIOptions = {
			description: 'Create your first publication',
			buttonText: 'Publish',
			transactionInfo: {
				title: 'New Publication',
				action: 'Create Publication',
				contractInfo: {
					name: 'Reverv. Factory',
				}
			}
		};

		// Send the transaction
		// This is the function that Privy uses to interact with the blockchain
		const result = await sendTransaction(txRequest, uiConfig);

		// Check transaction status
		if (result.status !== 1) {
			return { error: 'Transaction failed' };
		}

		// Get the publication address from the first log (the deployed contract address)
		const publicationAddress = result.logs[0].address;

		// Parse the post event from the logs
		const { tokenId, metadataURI, isGated } = parsePostCreatedEvent(result.logs);

		return {
			transactionHash: result.transactionHash,
			publicationAddress,
			tokenId,
			contentUri: metadataURI,
			isGated
		};
	} catch (error) {
		console.error('Error creating publication:', error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

/**
 * Creates a new post in an existing publication
 * @param content The content to post
 * @param publicationAddress The address of the publication contract
 * @param sendTransaction The Privy sendTransaction function
 * @param userAddress The address of the user creating the post
 * @returns Object containing the transaction result or error
 */
export async function createPost(
	content: string,
	publicationAddress: string,
	sendTransaction: (request: UnsignedTransactionRequest, uiConfig?: SendTransactionModalUIOptions) => Promise<TransactionResponse>,
	userAddress: string
): Promise<TransactionResult> {
	try {
		// Create the transaction request
		const txRequest = createPostTransaction(
			publicationAddress,
			content,
			userAddress,
			false
		);

		// Configure the UI options for the transaction
		const uiConfig: SendTransactionModalUIOptions = {
			description: 'Create a new post',
			buttonText: 'Publish',
			transactionInfo: {
				title: 'New Post',
				action: 'Create Post',
				contractInfo: {
					name: 'Reverv. Publication',
				}
			}
		};

		// Send the transaction
		const result = await sendTransaction(txRequest, uiConfig);

		// Check transaction status
		if (result.status !== 1) {
			return { error: 'Transaction failed' };
		}

		// Parse the post event from the logs
		const { tokenId, metadataURI, isGated } = parsePostCreatedEvent(result.logs);

		return {
			transactionHash: result.transactionHash,
			publicationAddress,
			tokenId,
			contentUri: metadataURI,
			isGated
		};
	} catch (error) {
		console.error('Error creating post:', error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

/**
 * Creates a post in an existing publication
 * @param publicationAddress The address of the publication contract
 * @param content The content to post
 * @param userAddress The address of the user creating the post (recipient)
 * @param isGated Whether the post should be gated
 * @returns The transaction request object for Privy
 */
export function createPostTransaction(
	publicationAddress: string,
	content: string,
	userAddress: string,
	isGated: boolean = false
): UnsignedTransactionRequest {
	// Get the contract interface
	const iface = new ethers.utils.Interface(MinimalCollectionABI.abi);

	// Encode the function call - pass content, recipient (user's address), and isGated
	const data = iface.encodeFunctionData("create", [content, userAddress, isGated]);

	// Return the unsigned transaction request
	return {
		to: publicationAddress,
		data,
		chainId: 11155420 // Optimism Sepolia
	};
}

/**
 * Creates a new publication and first post
 * @param name The name of the publication
 * @param contractURI The URI for the contract metadata
 * @param content The content of the first post
 * @param isGated Whether the first post should be gated
 * @param factoryAddress The address of the factory contract
 * @returns The transaction request object for Privy
 */
export function createPublicationAndFirstPostTransaction(
	name: string,
	contractURI: string,
	content: string,
	isGated: boolean = false,
	factoryAddress: string
): UnsignedTransactionRequest {
	// Get the contract interface
	const iface = new ethers.utils.Interface(CollectionFactoryABI.abi);

	// Encode the function call
	const data = iface.encodeFunctionData("createCollectionAndPost", [
		name,
		contractURI,
		content,
		isGated
	]);

	// Return the unsigned transaction request
	return {
		to: factoryAddress,
		data,
		chainId: 11155420 // Optimism Sepolia
	};
}

/**
 * Creates a transaction to collect a post
 * @param publicationAddress The address of the publication contract
 * @param tokenId The ID of the token to collect
 * @param userAddress The address of the user collecting the post
 * @returns The transaction request object for Privy
 */
export function createCollectTransaction(
	publicationAddress: string,
	tokenId: string,
	userAddress: string
): UnsignedTransactionRequest {
	console.log('Creating collect transaction request...');
	console.log('Parameters:', {
		publicationAddress,
		tokenId,
		userAddress,
		marketAddress: MINIMAL_MARKET_ADDRESS
	});

	// Get the contract interface
	const iface = new ethers.utils.Interface(MinimalCollectionABI.abi);

	// Convert numeric parameters to BigNumber
	const tokenIdBN = ethers.BigNumber.from(tokenId);
	const amountBN = ethers.BigNumber.from(1);

	// Set token price (0.00043 ETH)
	const tokenPrice = ethers.utils.parseEther("0.00043");

	// Encode the function call with the new parameters
	const data = iface.encodeFunctionData("collect", [
		tokenIdBN,            // tokenId as BigNumber
		amountBN,            // amount as BigNumber
		userAddress,         // recipient address
		ethers.constants.AddressZero,  // referer (zero address)
		MINIMAL_MARKET_ADDRESS         // market address
	]);
	console.log('Encoded function data:', data);

	// Return the unsigned transaction request
	const txRequest = {
		to: publicationAddress,
		data,
		value: tokenPrice.toHexString(), // Only include the token price
		chainId: 11155420 // Optimism Sepolia
	};
	console.log('Transaction request created:', txRequest);
	return txRequest;
}

export async function collectPost(
	publicationAddress: string,
	tokenId: string,
	sendTransaction: (request: UnsignedTransactionRequest, uiConfig?: SendTransactionModalUIOptions) => Promise<TransactionResponse>,
	userAddress: string
): Promise<TransactionResponse> {
	console.log('Collecting post...');

	try {
		// Configure the UI options for the transaction
		const collectUiConfig: SendTransactionModalUIOptions = {
			description: 'Collect this post',
			buttonText: 'Collect',
			transactionInfo: {
				title: 'Collect Post',
				action: 'Collect Post',
				contractInfo: {
					name: 'Reverv. Publication',
				}
			}
		};

		// Create and send collect transaction
		const collectTx = createCollectTransaction(publicationAddress, tokenId, userAddress);
		const collectResult = await sendTransaction(collectTx, collectUiConfig);
		console.log('Collect transaction result:', collectResult);

		if (collectResult.status !== 1) {
			throw new Error('Collect transaction failed');
		}

		return collectResult;
	} catch (error) {
		console.error('Error in collectPost:', error);
		if (error instanceof Error) {
			console.error('Error details:', {
				name: error.name,
				message: error.message,
				stack: error.stack
			});
		}
		throw error; // Re-throw the error to be handled by the component
	}
}
