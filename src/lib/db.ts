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
		return data;
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
		const { data, error } = await supabase
			.from('users')
			.insert([{
				...user,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			}])
			.select()
			.single();

		if (error) throw error;
		return data;
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
