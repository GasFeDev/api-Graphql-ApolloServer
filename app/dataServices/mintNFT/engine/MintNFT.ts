import { BigNumber, Contract, providers, Wallet } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { GAS_LIMIT } from "../../../constants/txUtil";
import { ERC721_ABI } from "../../../constants/abis";

export class MintNFT extends Base {
  private _sender: string;
  private _senderAddress: string;
  private _tokenContract: Contract;
  private _signerMock: Wallet;
  private _tokenId: BigNumber;
  private _tokenUri: string;
  private _amount: number;
  constructor(
    provider: providers.JsonRpcProvider,
    sender: string,
    senderAddress: string,
    _tokenAddress: string,
    tokenUri: string,
    tokenId: BigNumber,
    amount: number
  ) {
    super();
    if (!isAddress(senderAddress)) throw new Error("Bad Address");
    this._sender = sender;
    this._senderAddress = senderAddress;
    this._signerMock = new Wallet(this._sender, provider);

    this._tokenUri = tokenUri;
    this._tokenContract = new Contract(
      _tokenAddress,
      ERC721_ABI,
      this._signerMock
    );
    this._tokenId = tokenId;
    this._amount = amount;
  }

  async description(): Promise<string> {
    return (
      "Mint NFT " +
      " @ " +
      this._tokenContract.address +
      " tokenId " +
      this._tokenId +
      " Uri" +
      this._tokenUri
    );
  }

  async getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    console.log(
      "Mint metadata : ",
      this._senderAddress,
      this._tokenId,
      this._tokenUri
    );

    if (
      typeof this._tokenContract.safeMint === "function" ||
      typeof this._tokenContract.populateTransaction.safeMint === "function"
    ) {
      console.log("Found SAFE MINT: ");
      return [
        {
          ...(await this._tokenContract.populateTransaction.safeMint(
            this._senderAddress,
            this._tokenId,
            this._amount,
            this._tokenUri,
            {
              gasLimit: GAS_LIMIT,
            }
          )),
        },
      ];
    } else {
      console.log("Found ONLY MINT: ");
      return [
        {
          ...(await this._tokenContract.populateTransaction.mint(
            this._senderAddress,
            this._tokenUri,
            this._amount,
            this._tokenId,
            {
              gasLimit: GAS_LIMIT,
            }
          )),
        },
      ];
    }
  }
}
