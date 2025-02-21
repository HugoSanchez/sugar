export interface Profile {
  id: string;
  name: string;
  username: string;
  description: string;
  farcasterAddress?: string;  // Optional Farcaster connected address
  farcasterFid?: number;      // Optional Farcaster ID
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProfileInput = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>;
