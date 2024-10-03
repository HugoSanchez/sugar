import { ethers } from 'ethers';
import MinimalProfileRegistry from '../artifacts/contracts/MinimalProfileRegistry.sol/ProfileRegistry.json';
import MinimalFactory from '../artifacts/contracts/MinimalFactory.sol/CollectionFactory.json';
import { PROFILE_REGISTRY_ADDRESS, FACTORY_ADDRESS } from '../constants';

// Instantiates the PROFILE REGISTRY contract
export const getProfileRegistryContract = (signer: ethers.Signer) => {
	const contract = new ethers.Contract(PROFILE_REGISTRY_ADDRESS, MinimalProfileRegistry.abi, signer);
	return contract;
}

// Instantiates the FACTORY contract
export const getFactoryContract = (signer: ethers.Signer) => {
	const contract = new ethers.Contract(FACTORY_ADDRESS, MinimalFactory.abi, signer);
	return contract;
}
