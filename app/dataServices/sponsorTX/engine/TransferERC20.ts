import { BigNumber, Contract, providers } from "ethers";
import { isAddress, parseEther, formatEther } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { ERC20_ABI } from "../abis";
export class TransferERC20 extends Base {
  private _sender: string;
  private _recipient: string;
  private _tokenContract: Contract;
  private _amount: BigNumber;

  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    recipient: string,
    _tokenAddress: string,
    amount: BigNumber
  ) {
    super();
    if (!isAddress(sender)) throw new Error("Bad Address");
    if (!isAddress(recipient)) throw new Error("Bad Address");
    this._sender = sender;
    this._recipient = recipient;
    this._tokenContract = new Contract(_tokenAddress, ERC20_ABI, provider);
    this._amount = parseEther(formatEther(amount));
  }

  async description(): Promise<string> {
    return (
      "Transfer ERC20 balance " +
      (await this.getTokenBalance(this._sender)).toString() +
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

    console.log("Balance to be transfered : ", this._amount);
    return [
      {
        ...(await this._tokenContract.populateTransaction.transfer(
          this._recipient,
          this._amount
        )),
      },
    ];
  }

  private async getTokenBalance(tokenHolder: string): Promise<BigNumber> {
    return (await this._tokenContract.functions.balanceOf(tokenHolder))[0];
  }
}
