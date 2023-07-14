import * as factory from "./mintNFT";
import { ethers, BigNumber } from "ethers";
import { NftMintType } from "schema/generated";

const randomWallet = ethers.Wallet.createRandom();

const mockPayload = {
  tokenUri: 'XYZ',
  tokenAddress: randomWallet.address,
  tokenId: BigNumber.from(10),
  to: randomWallet.address,
  type: NftMintType.Lock,
}
describe("mintNFT test happy paths", () => {
  jest.spyOn(factory, "mintNFT").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  it("it should response happy path", async () => {
    const result = await factory.mintNFT({ ...mockPayload });

    expect(result).equal({ txStatus: 0, txId: "xyz" });
  });
});
