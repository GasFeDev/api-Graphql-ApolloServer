import { Contract, providers, Wallet } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { MINTERC20_ABI } from "../abis";

export class MintERC20 extends Base {
  private _contract: Contract;
  private _sender: string;
  private _signerMock: Wallet;
  private _amount: number;

  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    tokenAddress: string,
    amount: number
  ) {
    super();
    validatorField(tokenAddress);
    this._sender = sender;
    this._signerMock = new Wallet(this._sender, provider);
    this._contract = new Contract(
      tokenAddress,
      MINTERC20_ABI,
      this._signerMock
    );
    this._amount = amount;
  }

  async description(): Promise<string> {
    return "ERC20 Mint: " + this._amount;
  }

  async getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    const transaction = [
      {
        ...(await this._contract.populateTransaction.mint(this._amount)),
      },
    ];
    return transaction;
  }
}

export const validatorField = (tokenAddress: string) => {
  if (!isAddress(tokenAddress)) throw new Error("Bad Address: tokenAddress");
};
