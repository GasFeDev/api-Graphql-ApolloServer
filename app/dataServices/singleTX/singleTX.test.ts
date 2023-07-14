import * as txFactory from "./singleTX";
import { ethers } from "ethers";

const randomWallet = ethers.Wallet.createRandom();
const userWallet = ethers.Wallet.createRandom();

const mockPayload = {
  walletPrivateKey: userWallet.privateKey,
  contractAddress: randomWallet.address,
};

describe("singleTX test happy paths", () => {
  jest.spyOn(txFactory, "singleTX").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await txFactory.singleTX({ ...mockPayload });

    expect(result).toEqual({
      txStatus: 0,
      txId: "xyz",
    });
  });
});
