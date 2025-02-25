import { createClient } from '@supabase/supabase-js';
import { User, CreateUserInput } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getUserByUsername(username: string): Promise<User | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('username', username)
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error getting user by username:', error);
		return null;
	}
}

export async function getUserByPrivyId(privyId: string): Promise<User | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('privy_id', privyId)
			.single();

		if (error) throw error;

		// Map snake_case back to camelCase
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

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
	try {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('wallet_address', walletAddress)
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error getting user by wallet address:', error);
		return null;
	}
}

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
