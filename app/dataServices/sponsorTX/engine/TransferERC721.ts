import { BigNumber, Contract, providers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { GAS_LIMIT } from "../../../constants/txUtil";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { ERC721TX_ABI } from "../abis";

export class TransferERC721 extends Base {
  private _sender: string;
  private _recipient: string;
  private _tokenContract: Contract;
  private _tokenId: BigNumber;

  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    recipient: string,
    _tokenAddress: string,
    tokenId: BigNumber
  ) {
    super();
    if (!isAddress(sender)) throw new Error("Bad Address");
    if (!isAddress(recipient)) throw new Error("Bad Address");
    this._sender = sender;
    this._recipient = recipient;
    this._tokenContract = new Contract(_tokenAddress, ERC721TX_ABI, provider);
    this._tokenId = tokenId;
  }

  async description(): Promise<string> {
    return (
      "Transfer ERC721 from balance" +
      (await this.getTokenBalance(this._sender)).toString() +
      " Token ID: " +
      this._tokenId +
      " @ " +
      this._tokenContract.address +
      " from " +
      this._sender +
      " to " +
      this._recipient
    );
  }

  async getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    const tokenBalance = await this.getTokenBalance(this._sender);
    if (tokenBalance.eq(0)) {
      throw new Error(
        `No Token Balance: ${this._sender} does not have any balance of ${this._tokenContract.address}`
      );
    }

    console.log("TokenID to be transfered : ", this._tokenId);
    return [
      {
        ...(await this._tokenContract.populateTransaction.transferFrom(
          this._sender,
          this._recipient,
          this._tokenId,
          {
            gasLimit: GAS_LIMIT,
          }
        )),
      },
    ];
  }

  private async getTokenBalance(tokenHolder: string): Promise<BigNumber> {
    return (await this._tokenContract.functions.balanceOf(tokenHolder))[0];
  }
}
