import { NextRequest, NextResponse } from 'next/server';
import { getUserByPrivyId, getPublicationByAddress, createPost } from '@/lib/db';
import { CreatePostInput } from '@/lib/types';

export async function POST(req: NextRequest) {
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

        // Get request body
        const body = await req.json();
        const postData: CreatePostInput = body;

        // Verify the publication exists and belongs to the user
        const publication = await getPublicationByAddress(postData.publicationAddress);
        if (!publication) {
            return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
        }

        // Check if the publication belongs to the user
        if (publication.userId !== user.id) {
            return NextResponse.json({ error: 'Not authorized to post to this publication' }, { status: 403 });
        }

        // Create the post
        const newPost = await createPost({
            ...postData,
            publicationId: publication.id // Ensure we use the correct publication ID
        });

        if (!newPost) {
            return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
        }

        return NextResponse.json(newPost);
    } catch (error) {
        console.error('Error in post creation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
