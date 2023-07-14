import { BigNumber, Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "../../utils/Base";
import { ERC721_ABI } from "../../../constants/abis";

export class Approval721 extends Base {
  private _recipient: string;
  private _contractAddresses721: string[];

  constructor(recipient: string, contractAddresses721: string[]) {
    super();
    if (!isAddress(recipient)) throw new Error("Bad Address");
    this._recipient = recipient;
    this._contractAddresses721 = contractAddresses721;
  }

  async description(): Promise<string> {
    return `Giving ${
      this._recipient
    } approval for: ${this._contractAddresses721.join(", ")}`;
  }

  getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    return Promise.all(
      this._contractAddresses721.map(async (contractAddress721) => {
        const erc721Contract = new Contract(contractAddress721, ERC721_ABI);
        return {
          ...(await erc721Contract.populateTransaction.setApprovalForAll(
            this._recipient,
            true
          )),
          gasPrice: BigNumber.from(0),
        };
      })
    );
  }
}
