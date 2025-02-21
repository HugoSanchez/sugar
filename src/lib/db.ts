import { createClient } from '@supabase/supabase-js';
import { Profile, CreateProfileInput } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function createProfile(profile: CreateProfileInput): Promise<Profile> {
	const { data, error } = await supabase
		.from('profiles')
		.insert([
			{
				...profile,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		])
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data as Profile;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('username', username)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			return null;
		}
		throw new Error(error.message);
	}

	return data as Profile;
}

export async function updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
	const { data, error } = await supabase
		.from('profiles')
		.update({
			...profile,
			updated_at: new Date().toISOString(),
		})
		.eq('id', id)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data as Profile;
}
