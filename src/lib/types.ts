export interface Profile {
  id: string;
  username: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  farcasterAddress?: string;  // Optional Farcaster connected address
  farcasterFid?: number;      // Optional Farcaster ID
}

export type CreateProfileInput = Omit<Profile, 'createdAt' | 'updatedAt'>;
