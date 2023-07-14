import * as factory from "./setDescription";
import { ethers } from "ethers";

const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  stringArgument: 'XYZ',
  contractAddress: randomWallet.address,
}

describe("mintNFT test happy paths", () => {
  jest.spyOn(factory, 'setDescription').mockResolvedValueOnce({
    txStatus: 0,
    txId: 'xyz',
  })

  it("it should response happy path", async () => {
    const result = await factory.setDescription({
      input: mockPayload,
    })

    expect(result).equal({ txStatus: 0, txId: "xyz" });
  });
});
