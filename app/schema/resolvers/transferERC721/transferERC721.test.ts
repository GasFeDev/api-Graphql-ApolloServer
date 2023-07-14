import * as factory from "./transferERC721";
import { ethers } from "ethers";

const executorWallet = ethers.Wallet.createRandom();
const sponsorWallet = ethers.Wallet.createRandom();
const ownerWallet = ethers.Wallet.createRandom();
const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  executor: executorWallet.privateKey,
  sponsor: sponsorWallet.privateKey,
  gasLimit: 1,
  gasPrice: 1,
  to: ownerWallet.address,
  contractAddress: randomWallet.address,
  tokenId: 10,
  description: "xDescription",
};

describe("test happy paths", () => {
  jest.spyOn(factory, "transferERC721").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.transferERC721({
      input: mockPayload,
    });

    expect(result).toEqual({ txStatus: 0, txId: "xyz" });
  });
});
