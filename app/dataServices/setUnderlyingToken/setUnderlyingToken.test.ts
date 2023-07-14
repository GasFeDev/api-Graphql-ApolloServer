import * as factory from "./setUnderlyingToken";
import { ethers, BigNumber } from "ethers";

const executorWallet = ethers.Wallet.createRandom();
const sponsorWallet = ethers.Wallet.createRandom();
const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  contractAddress: randomWallet.address,
  isERC20: true,
  underlyingToken: randomWallet.address,
}
describe("mintNFT test happy paths", () => {
  jest.spyOn(factory, 'setUnderlyingToken').mockResolvedValueOnce({
    txStatus: 0,
    txId: 'xyz',
  })

  it("it should response happy path", async () => {
    const result = await factory.setUnderlyingToken(mockPayload)

    expect(result).equal({ txStatus: 0, txId: "xyz" });
  });
});
