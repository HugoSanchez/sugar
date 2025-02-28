import { createClient } from '@supabase/supabase-js';
import { User, CreateUserInput, Publication, CreatePublicationInput, Post, CreatePostInput } from './types';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define fields that are safe to return to any user
// Excludes private data like email and privyId
const publicUserFields = 'id, username, name, description, wallet_address, farcaster_address, farcaster_fid, created_at, updated_at';

/**
 * Fetches a user by their username, returning only public fields
 * @param username - The username to search for
 * @returns A partial user object with only public fields, or null if not found
 */
export async function getUserByUsername(username: string): Promise<Partial<User> | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select(publicUserFields)
			.eq('username', username)
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				username: data.username,
				name: data.name,
				description: data.description,
				walletAddress: data.wallet_address,
				farcasterAddress: data.farcaster_address,
				farcasterFid: data.farcaster_fid,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error getting user by username:', error);
		return null;
	}
}

/**
 * Fetches a user by their Privy ID, returning all fields
 * This function is used for authentication and should only be called
 * when the requesting user has been verified as the owner of the Privy ID
 * @param privyId - The Privy ID to search for
 * @returns A complete user object with all fields, or null if not found
 */
export async function getUserByPrivyId(privyId: string): Promise<User | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('privy_id', privyId)
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				privyId: data.privy_id,
				walletAddress: data.wallet_address,
				emailAddress: data.email_address,
				username: data.username,
				name: data.name,
				description: data.description,
				farcasterAddress: data.farcaster_address,
				farcasterFid: data.farcaster_fid,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error getting user by Privy ID:', error);
		return null;
	}
}

/**
 * Fetches a user by their wallet address, returning only public fields
 * @param walletAddress - The wallet address to search for
 * @returns A partial user object with only public fields, or null if not found
 */
export async function getUserByWalletAddress(walletAddress: string): Promise<Partial<User> | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select(publicUserFields)
			.eq('wallet_address', walletAddress)
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				username: data.username,
				name: data.name,
				description: data.description,
				walletAddress: data.wallet_address,
				farcasterAddress: data.farcaster_address,
				farcasterFid: data.farcaster_fid,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error getting user by wallet address:', error);
		return null;
	}
}

/**
 * Creates a new user in the database
 * @param user - The user data to create
 * @returns The created user object with all fields, or null if creation failed
 */
export async function createUser(user: CreateUserInput): Promise<User | null> {
	try {
		// Map camelCase to snake_case for database columns
		const dbUser = {
			privy_id: user.privyId,
			wallet_address: user.walletAddress,
			email_address: user.emailAddress,
			username: user.username,
			name: user.name,
			description: user.description,
			farcaster_address: user.farcasterAddress,
			farcaster_fid: user.farcasterFid,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		const { data, error } = await supabase
			.from('users')
			.insert([dbUser])
			.select()
			.single();

		if (error) throw error;

		// Map snake_case back to camelCase for the return value
		if (data) {
			return {
				id: data.id,
				privyId: data.privy_id,
				walletAddress: data.wallet_address,
				emailAddress: data.email_address,
				username: data.username,
				name: data.name,
				description: data.description,
				farcasterAddress: data.farcaster_address,
				farcasterFid: data.farcaster_fid,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error creating user:', error);
		return null;
	}
}

/**
 * Updates an existing user's information
 * @param id - The database ID of the user to update
 * @param updates - Partial user object containing the fields to update
 * @returns The updated user object, or null if update failed
 */
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error updating user:', error);
		return null;
	}
}

/**
 * Creates a subscription relationship between two users
 * @param subscriberId - The database ID of the user who wants to subscribe
 * @param publisherId - The database ID of the user to subscribe to
 * @returns A boolean indicating whether the subscription was successful
 */
export async function subscribeToUser(subscriberId: string, publisherId: string): Promise<boolean> {
	console.log('subscribeToUser', subscriberId);
	console.log('publisherId', publisherId);
	try {
		const { error } = await supabase
			.from('subscriptions')
			.insert([{
				subscriber_id: subscriberId,
				publisher_id: publisherId
			}]);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error('Error creating subscription:', error);
		return false;
	}
}

/**
 * Fetches all subscriptions for a user via API
 * Security is handled by the API endpoint which verifies the requesting user's identity
 * @param userId - The database ID of the user whose subscriptions to fetch
 * @param privyId - The Privy ID of the requesting user (for authentication)
 * @returns An array of publisher IDs that the user is subscribed to
 */
export async function getSubscriptions(userId: string, privyId: string): Promise<{ publisher_id: string }[]> {
	try {
		const response = await fetch('/api/subscriptions', {
			headers: {
				'x-privy-id': privyId
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Failed to get subscriptions');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error getting subscriptions:', error);
		return [];
	}
}

/**
 * Removes a subscription relationship between two users
 * @param subscriberId - The database ID of the user who wants to unsubscribe
 * @param publisherId - The database ID of the user to unsubscribe from
 * @returns A boolean indicating whether the unsubscription was successful
 */
export async function unsubscribeFromUser(subscriberId: string, publisherId: string): Promise<boolean> {
	try {
		const { error } = await supabase
			.from('subscriptions')
			.delete()
			.eq('subscriber_id', subscriberId)
			.eq('publisher_id', publisherId);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error('Error removing subscription:', error);
		return false;
	}
}

/**
 * Checks if a user is subscribed to another user
 * @param subscriberId - The database ID of the user who might be subscribed
 * @param publisherId - The database ID of the user to check subscription for
 * @returns A boolean indicating whether the subscription exists
 */
export async function isSubscribedToUser(subscriberId: string, publisherId: string): Promise<boolean> {
	try {
		const { data, error } = await supabase
			.from('subscriptions')
			.select('id')
			.eq('subscriber_id', subscriberId)
			.eq('publisher_id', publisherId)
			.single();

		if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
			throw error;
		}

		return !!data;
	} catch (error) {
		console.error('Error checking subscription:', error);
		return false;
	}
}

/**
 * Creates a new publication for a user
 * @param publication - The publication data to create
 * @returns The created publication object, or null if creation failed
 */
export async function createPublication(publication: CreatePublicationInput): Promise<Publication | null> {
	try {
		const { data, error } = await supabase
			.from('publications')
			.insert([{
				user_id: publication.userId,
				address: publication.address,
				standard: publication.standard,
				network: publication.network
			}])
			.select()
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				userId: data.user_id,
				address: data.address,
				standard: data.standard,
				network: data.network,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error creating publication:', error);
		return null;
	}
}

/**
 * Gets a publication by its address
 * @param address - The smart contract address of the publication
 * @returns The publication object, or null if not found
 */
export async function getPublicationByAddress(address: string): Promise<Publication | null> {
	try {
		const { data, error } = await supabase
			.from('publications')
			.select('*')
			.eq('address', address)
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				userId: data.user_id,
				address: data.address,
				standard: data.standard,
				network: data.network,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error getting publication:', error);
		return null;
	}
}

/**
 * Gets all publications for a user
 * @param userId - The database ID of the user
 * @returns Array of publication objects
 */
export async function getUserPublications(userId: string): Promise<Publication[]> {
	try {
		const { data, error } = await supabase
			.from('publications')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) throw error;

		return (data || []).map(pub => ({
			id: pub.id,
			userId: pub.user_id,
			address: pub.address,
			standard: pub.standard,
			network: pub.network,
			createdAt: new Date(pub.created_at),
			updatedAt: new Date(pub.updated_at)
		}));
	} catch (error) {
		console.error('Error getting user publications:', error);
		return [];
	}
}

/**
 * Creates a new post in a publication
 * @param post - The post data to create
 * @returns The created post object, or null if creation failed
 */
export async function createPost(post: CreatePostInput): Promise<Post | null> {
	try {
		const { data, error } = await supabase
			.from('posts')
			.insert([{
				publication_id: post.publicationId,
				publication_address: post.publicationAddress,
				content: post.content,
				token_id: post.tokenId,
				transaction_hash: post.transactionHash,
				block_timestamp: post.blockTimestamp
			}])
			.select()
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				publicationId: data.publication_id,
				publicationAddress: data.publication_address,
				content: data.content,
				tokenId: data.token_id,
				transactionHash: data.transaction_hash,
				blockTimestamp: data.block_timestamp ? new Date(data.block_timestamp) : undefined,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error creating post:', error);
		return null;
	}
}

/**
 * Updates a post with blockchain transaction details
 * @param postId - The database ID of the post
 * @param transactionHash - The hash of the transaction
 * @param blockTimestamp - The timestamp of the block
 * @returns The updated post object, or null if update failed
 */
export async function updatePostTransaction(
	postId: string,
	transactionHash: string,
	blockTimestamp: Date
): Promise<Post | null> {
	try {
		const { data, error } = await supabase
			.from('posts')
			.update({
				transaction_hash: transactionHash,
				block_timestamp: blockTimestamp.toISOString()
			})
			.eq('id', postId)
			.select()
			.single();

		if (error) throw error;

		if (data) {
			return {
				id: data.id,
				publicationId: data.publication_id,
				publicationAddress: data.publication_address,
				content: data.content,
				tokenId: data.token_id,
				transactionHash: data.transaction_hash,
				blockTimestamp: data.block_timestamp ? new Date(data.block_timestamp) : undefined,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};
		}
		return null;
	} catch (error) {
		console.error('Error updating post transaction:', error);
		return null;
	}
}

/**
 * Gets all posts for a publication
 * @param publicationId - The database ID of the publication
 * @returns Array of post objects
 */
export async function getPublicationPosts(publicationId: string): Promise<Post[]> {
	try {
		const { data, error } = await supabase
			.from('posts')
			.select('*')
			.eq('publication_id', publicationId)
			.order('created_at', { ascending: false });

		if (error) throw error;

		return (data || []).map(post => ({
			id: post.id,
			publicationId: post.publication_id,
			publicationAddress: post.publication_address,
			content: post.content,
			tokenId: post.token_id,
			transactionHash: post.transaction_hash,
			blockTimestamp: post.block_timestamp ? new Date(post.block_timestamp) : undefined,
			createdAt: new Date(post.created_at),
			updatedAt: new Date(post.updated_at)
		}));
	} catch (error) {
		console.error('Error getting publication posts:', error);
		return [];
	}
}

// Export supabase client for use in API routes only
// This should not be used directly in components
export { supabase };
