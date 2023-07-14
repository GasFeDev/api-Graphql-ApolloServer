import { NftMintType } from './../../generated';
import * as factory from "./mintNFT";
import { ethers } from "ethers";

const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  tokenUri: "XYZ",
  tokenAddress: randomWallet.address,
  tokenId: 10,
  to: randomWallet.address,
  type: NftMintType.Lock,
};

describe("mintNFT test happy paths", () => {
  jest.spyOn(factory, "mintNFT").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.mintNFT({
      input: mockPayload,
    });

    expect(result).equal({ txStatus: 0, txId: "xyz" });
  });
});
