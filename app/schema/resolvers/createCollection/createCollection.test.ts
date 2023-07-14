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
  requireMultisignURI: false,
  lockERC20: "",
  lockEnabled: false,
  name: "Test",
  mintLimitItems: 1,
  symbol: "Test",
  onChainMetadata: false,
  isDynamic: false,
};

test("it should response happy path", async () => {
  jest.spyOn(collectionFactory, "createCollection").mockResolvedValueOnce({
    errors: [],
    address: "",
    collectionOwner: mockPayload.collectionOwner,
    txResponse: {
      txStatus: 0,
      txId: "xyz",
    },
  });

  const result = await collectionFactory.createCollection({
    input: mockPayload,
  });

  expect(result).toEqual({
    errors: [],
    address: "",
    collectionOwner: mockPayload.collectionOwner,
    txResponse: {
      txStatus: 0,
      txId: "xyz",
    },
  });
});
