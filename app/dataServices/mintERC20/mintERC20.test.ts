import * as factory from "./mintERC20";
import { ethers } from "ethers";

const randomWallet = ethers.Wallet.createRandom();
const userWallet = ethers.Wallet.createRandom();

const mockPayload = {
  privateKeyExecutor: userWallet.privateKey,
  privateKeySponsor: userWallet.privateKey,
  contractAddress: randomWallet.address,
  amount: 80000,
  data: "xyz",
};

describe("mintERC20 test happy paths", () => {
  jest.spyOn(factory, "mintERC20").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.mintERC20({ ...mockPayload });

    expect(result).toEqual({ txStatus: 0, txId: "xyz" });
  });
});
