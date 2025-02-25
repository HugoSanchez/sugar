export interface User {
  id: string;
  privyId: string;      // Required Privy user ID
  walletAddress: string; // Required wallet address
  emailAddress: string;  // Required email address
  username: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  farcasterAddress?: string;  // Optional Farcaster connected address
  farcasterFid?: number;      // Optional Farcaster ID
}

export type CreateUserInput = Omit<User, 'createdAt' | 'updatedAt'>;
