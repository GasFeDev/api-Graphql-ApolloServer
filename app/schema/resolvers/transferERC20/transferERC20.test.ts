import * as factory from "./transferERC20";
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
  tokenAddress: randomWallet.address,
  value: 10,
  description: "xDescription",
};

describe("test happy paths", () => {
  jest.spyOn(factory, "transferERC20").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.transferERC20({
      input: mockPayload,
    });

    expect(result).toEqual({ txStatus: 0, txId: "xyz" });
  });
});
