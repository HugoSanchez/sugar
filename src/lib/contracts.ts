import { ethers } from 'ethers';
import CollectionFactoryABI from '../artifacts/contracts/MinimalFactory.sol/CollectionFactory.json';
import MinimalCollectionABI from '../artifacts/contracts/MinimalCollection.sol/MinimalCollection.json';
import { UnsignedTransactionRequest, SendTransactionModalUIOptions, useSendTransaction } from '@privy-io/react-auth';

interface TransactionLog {
	address: string;
	topics: string[];
	data: string;
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

	// Parse the tokenId from the first topic (it's indexed)
	// Convert from hex to decimal string, removing any leading zeros
	const tokenId = ethers.BigNumber.from(postLog.topics[1]).toString();

	// Decode the non-indexed parameters from the data field
	const decodedData = iface.decodeEventLog(
		'NewPostCreated',
		postLog.data,
		postLog.topics
	);

	console.log('Decoded data:', decodedData);

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
	sendTransaction: (request: UnsignedTransactionRequest, uiConfig?: SendTransactionModalUIOptions) => Promise<any>
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
		console.log('Transaction result:', result);

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
	sendTransaction: (request: UnsignedTransactionRequest, uiConfig?: SendTransactionModalUIOptions) => Promise<any>,
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
		console.log('Transaction result:', result);

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
