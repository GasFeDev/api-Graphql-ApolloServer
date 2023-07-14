import { Contract, providers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { CRYPTO_KITTIES_ABI } from "../abis";
const CRYPTO_KITTIES_ADDRESS = "0x06012c8cf97bead5deae237070f9587f8e7a266d";
export class CryptoKitties extends Base {
  private _sender: string;
  private _recipient: string;
  private _kittyIds: number[];
  private _cryptoKittiesContract: Contract;

  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    recipient: string,
    kittyIds: number[]
  ) {
    super();
    if (!isAddress(sender)) throw new Error("Bad Address");
    if (!isAddress(recipient)) throw new Error("Bad Address");
    this._sender = sender;
    this._recipient = recipient;
    this._kittyIds = kittyIds;
    this._cryptoKittiesContract = new Contract(
      CRYPTO_KITTIES_ADDRESS,
      CRYPTO_KITTIES_ABI,
      provider
    );
  }

  async description(): Promise<string> {
    return (
      "Sending these kitties " +
      this._kittyIds.join(",") +
      " from " +
      this._sender +
      " to " +
      this._recipient
    );
  }

  async getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    await Promise.all(
      this._kittyIds.map(async (kittyId) => {
        const owner = await this._cryptoKittiesContract.functions.ownerOf(
          kittyId
        );
        if (owner.owner !== this._sender)
          throw new Error(
            "Kitty: " + kittyId + " is not owned by " + this._sender
          );
      })
    );
    return Promise.all(
      this._kittyIds.map(async (kittyId) => {
        return {
          ...(await this._cryptoKittiesContract.populateTransaction.transfer(
            this._recipient,
            kittyId
          )),
        };
      })
    );
  }
}
