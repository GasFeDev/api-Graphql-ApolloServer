import * as collectionFactory from "./createCollection";
import { ethers } from "ethers";

const executorWallet = ethers.Wallet.createRandom();
const sponsorWallet = ethers.Wallet.createRandom();
const ownerWallet = ethers.Wallet.createRandom();

const mockPayload = {
  executor: executorWallet.privateKey,
  sponsor: sponsorWallet.privateKey,
  collectionOwner: ownerWallet.address,
  contractUri: "uriParam",
  isMintLimitEnabled: false,
  name: "Test",
  mintLimitItems: 1,
  symbol: "Test",
  lockERC20: "",
  lockEnabled: false,
  onChainMetadata: false,
  requireMultisignURI: false,
  isDynamic: false,
};

test("createCollectionService it should response happy path", async () => {
  jest.spyOn(collectionFactory, "createCollection").mockResolvedValueOnce({
    txStatus: 0,
    txId: "xyz",
  });

  const result = await collectionFactory.createCollection({
    collectionPayload: mockPayload,
  });

  expect(result).toEqual({
    txStatus: 0,
    txId: "xyz",
  });
});
