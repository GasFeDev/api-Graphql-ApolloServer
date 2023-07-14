import { BigNumber } from "ethers";

export const BLOCKS_IN_FUTURE: number = 2;
export const GWEI: BigNumber = BigNumber.from(10).pow(9);
export const PRIORITY_GAS_PRICE: BigNumber = GWEI.mul(31);
export const GAS_LIMIT: number = 5000000;
export const BIG0: BigNumber = BigNumber.from(0);
export const ETHER: BigNumber = BigNumber.from(10).mul(BigNumber.from(18));
export const CREATE_COLLECTION_LOG = 3;
export const CREATE_ERC20_LOG = 3;
