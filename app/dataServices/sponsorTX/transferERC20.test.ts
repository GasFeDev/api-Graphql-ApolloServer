import * as factory from "./transferERC20";
import { ethers, BigNumber } from "ethers";

const executorWallet = ethers.Wallet.createRandom();
const sponsorWallet = ethers.Wallet.createRandom();
const ownerWallet = ethers.Wallet.createRandom();
const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  privateKeyExecutor: executorWallet.privateKey,
  privateKeySponsor: sponsorWallet.privateKey,
  gasLimit: BigNumber.from(5),
  gasPrice: BigNumber.from(1),
  recipentAddress: ownerWallet.address,
  tokenAddress: randomWallet.address,
  value: BigNumber.from(10),
  description: "xDescription",
};

describe("test happy paths", () => {
  jest.spyOn(factory, "transferERC20").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.transferERC20({ ...mockPayload });

    expect(result).toEqual({ txStatus: 0, txId: "xyz" });
  });
});
