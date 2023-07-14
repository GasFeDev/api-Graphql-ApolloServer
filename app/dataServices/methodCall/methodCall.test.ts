import { TX_APPROVAL_ERC721 } from './../../constants/txTypes'
import * as factory from './methodCall'
import { ethers, BigNumber } from 'ethers'

const randomWallet = ethers.Wallet.createRandom()

const mockPayload = [
  [randomWallet.address, BigNumber.from(10)],
  randomWallet.address,
  'approve',
  TX_APPROVAL_ERC721,
]
describe('mintNFT test happy paths', () => {
  jest.spyOn(factory, 'methodCall').mockResolvedValueOnce({
    txStatus: 0,
    txId: 'xyz',
  })

  it('it should response happy path', async () => {
    const result = await factory.methodCall.apply(null, mockPayload as any)

    expect(result).equal({ txStatus: 0, txId: 'xyz' })
  })
})
