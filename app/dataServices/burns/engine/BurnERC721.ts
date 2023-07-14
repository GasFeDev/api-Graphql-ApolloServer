import { Contract, providers, Wallet, BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { GAS_LIMIT } from "../../../constants/txUtil";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { BURNERC20_ABI } from "../abis";

export class BurnERC721 extends Base {
  private _contract: Contract;
  private _sender: string;
  private _signerMock: Wallet;
  private _tokenId: BigNumber;

  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    tokenAddress: string,
    tokenId: BigNumber
  ) {
    super();
    validatorField(tokenAddress);
    this._sender = sender;
    this._signerMock = new Wallet(this._sender, provider);
    this._contract = new Contract(tokenAddress, BURNERC20_ABI, provider);
    this._tokenId = tokenId;
  }

  async description(): Promise<string> {
    return "ERC721 Burn: " + this._tokenId;
  }

  async getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    const transaction = [
      {
        ...(await this._contract.populateTransaction.burn(this._tokenId, {
          gasLimit: GAS_LIMIT,
        })),
      },
    ];
    return transaction;
  }
}

export const validatorField = (tokenAddress: string) => {
  if (!isAddress(tokenAddress)) throw new Error("Bad Address: tokenAddress");
};
