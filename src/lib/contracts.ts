import { ethers } from 'ethers';
import CollectionFactoryABI from '../artifacts/contracts/MinimalFactory.sol/CollectionFactory.json';
import IMinimalCollectionABI from '../artifacts/contracts/MinimalFactory.sol/IMinimalCollection.json';

// Contract instantiation functions
export function getFactoryContract(signerOrProvider: ethers.Signer | ethers.providers.Provider, address: string) {
  return new ethers.Contract(
    address,
    CollectionFactoryABI.abi,
    signerOrProvider
  );
}

export function getPublicationContract(signerOrProvider: ethers.Signer | ethers.providers.Provider, address: string) {
  return new ethers.Contract(
    address,
    IMinimalCollectionABI.abi,
    signerOrProvider
  );
}

// Contract interaction functions
export async function createPost(
  publicationAddress: string,
  content: string,
  isGated: boolean = false,
  signer: ethers.Signer
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Creating post with:', { publicationAddress, content, isGated });
    const collection = getPublicationContract(signer, publicationAddress);
    const tx = await collection.create(content, await signer.getAddress(), isGated);
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    return { success: true };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function createPublicationAndFirstPost(
  name: string,
  contractURI: string,
  content: string,
  isGated: boolean = false,
  factoryAddress: string,
  signer: ethers.Signer
): Promise<{ success: boolean; publicationAddress?: string; error?: string }> {
  try {
    console.log('Creating publication with:', { name, contractURI, content, isGated });
    console.log('Factory address:', factoryAddress);
    console.log('Signer:', {
      signer,
      provider: signer.provider,
      address: await signer.getAddress()
    });

    const factory = getFactoryContract(signer, factoryAddress);
    console.log('Factory contract:', factory);

    console.log('Calling createCollectionAndPost...');
    const tx = await factory.createCollectionAndPost(name, contractURI, content, isGated);
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    const event = receipt.events?.find(
      (e: any) => e.event === 'CollectionCreatedWithPost'
    );

    if (!event) {
      throw new Error('Publication creation event not found');
    }

    const publicationAddress = event.args.collection;
    console.log('New publication created at:', publicationAddress);

    return {
      success: true,
      publicationAddress
    };
  } catch (error) {
    console.error('Error creating publication:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
