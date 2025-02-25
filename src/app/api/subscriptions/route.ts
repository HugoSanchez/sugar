import { NextRequest, NextResponse } from 'next/server';
import { getUserByPrivyId, supabase } from '@/lib/db';

export async function GET(req: NextRequest) {
	try {
		const privyId = req.headers.get('x-privy-id');
		if (!privyId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get the authenticated user's DB record
		const user = await getUserByPrivyId(privyId);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 401 });
		}

		// Get subscriptions
		const { data, error } = await supabase
			.from('subscriptions')
			.select('publisher_id')
			.eq('subscriber_id', user.id);

		if (error) throw error;
		return NextResponse.json(data || []);
	} catch (error) {
		console.error('Error fetching subscriptions:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const privyId = req.headers.get('x-privy-id');
		if (!privyId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { publisherId } = await req.json();
		if (!publisherId) {
			return NextResponse.json({ error: 'Publisher ID is required' }, { status: 400 });
		}

		// Get the authenticated user's DB record
		const user = await getUserByPrivyId(privyId);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 401 });
		}

		// Create the subscription
		const { error } = await supabase
			.from('subscriptions')
			.insert([{
				subscriber_id: user.id,
				publisher_id: publisherId
			}]);

		if (error) throw error;
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Subscription error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const privyId = req.headers.get('x-privy-id');
		if (!privyId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { publisherId } = await req.json();
		if (!publisherId) {
			return NextResponse.json({ error: 'Publisher ID is required' }, { status: 400 });
		}

		// Get the authenticated user's DB record
		const user = await getUserByPrivyId(privyId);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 401 });
		}

		// Delete the subscription
		const { error } = await supabase
			.from('subscriptions')
			.delete()
			.eq('subscriber_id', user.id)
			.eq('publisher_id', publisherId);

		if (error) throw error;
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Unsubscribe error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
