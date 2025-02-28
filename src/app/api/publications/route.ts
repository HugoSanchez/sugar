import { NextRequest, NextResponse } from 'next/server';
import { getUserByPrivyId, createPublication, createPost, getUserPublications } from '@/lib/db';
import { CreatePublicationInput, CreatePostInput } from '@/lib/types';

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
        const { publication, post }: {
            publication: Omit<CreatePublicationInput, 'userId'>,
            post?: Omit<CreatePostInput, 'publicationId' | 'publicationAddress'>
        } = body;

        // Create publication
        const newPublication = await createPublication({
            ...publication,
            userId: user.id // Ensure we use the authenticated user's ID
        });

        if (!newPublication) {
            return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
        }

        // If post data is provided, create the post
        let newPost = null;
        if (post) {
            newPost = await createPost({
                ...post,
                publicationId: newPublication.id,
                publicationAddress: newPublication.address
            });

            if (!newPost) {
                // Note: We don't rollback the publication creation as it's still valid
                return NextResponse.json({
                    error: 'Publication created but failed to create post',
                    publication: newPublication
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            publication: newPublication,
            post: newPost
        });
    } catch (error) {
        console.error('Error in publication creation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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

        // Get user's publications
        const publications = await getUserPublications(user.id);
        return NextResponse.json({ publications });
    } catch (error) {
        console.error('Error fetching publications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
