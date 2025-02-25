import { NextRequest, NextResponse } from 'next/server';
import { getUserByPrivyId, supabase } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const privyId = req.headers.get('x-privy-id');
        const publisherId = req.nextUrl.searchParams.get('publisherId');

        if (!privyId || !publisherId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Get the authenticated user's DB record
        const user = await getUserByPrivyId(privyId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // Check if subscription exists
        const { data, error } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('subscriber_id', user.id)
            .eq('publisher_id', publisherId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
            throw error;
        }

        return NextResponse.json({ isSubscribed: !!data });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
