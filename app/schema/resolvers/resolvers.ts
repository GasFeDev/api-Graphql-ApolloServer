import { getAllPeople, getPerson } from './people'
import { transferERC20 } from './transferERC20'
import { singleTX } from './singleTX'
import { createCollectionNFT } from './createCollectionNFT'
import { mintNFT } from './mintNFT'
import { burnNft } from './burnNFT'
import { mintERC20 } from './mintERC20'
import { transferERC721 } from './transferERC721'
import { transferNft } from './transferNFT'
import { createCollection } from './createCollection'
import { createERC20 } from './createERC20'
import { burnERC20 } from './burnERC20'
import { burnERC721 } from './burnERC721'
import { setUnderlyingToken } from './setUnderlyingToken'
import { setBaseUri } from './setBaseUri'
import { setContractURI } from './setContractUri'
import { setPropertyNames } from './setPropertyNames'
import { setPropertyValue } from './setPropertyValue'
import { setDynamicSvg } from './setDynamicSvg'
import { setTrustedForwarder } from './setTrustedForwarder'
import { setApprovalForAll } from './setApprovalForAll'
import { setUniqueSVG } from './setUniqueSVG'
import { setTokenURI } from './setTokenURI'
import { equipToken } from './equipToken'
import { unequipToken } from './unequipToken'
import { receiveTransaction } from './receiveTransaction'

export const resolvers = {
  Query: {
    getAllPeople: () => getAllPeople(), //if the user runs the getAllPeople command
    //if the user runs the getPerson command:
    getPerson: (_: any, args: any) => getPerson(args.id),
    singleTX: (_: any, args: any) => singleTX(args),
  },
  Mutation: {
    createCollection: (_: any, args: any) => createCollection(args),
    createERC20: (_: any, args: any) => createERC20(args),
    burn: (_: any, args: any) => burnERC20(args),
    burnERC721: (_: any, args: any) => burnERC721(args),
    transferERC721: (_: any, args: any) => transferERC721(args),
    transferNft: (_: any, args: any) => transferNft(args),
    createCollectionNFT: (_: any, args: any) => createCollectionNFT(args),
    mintNFT: (_: any, args: any) => mintNFT(args),
    burnNft: (_: any, args: any) => burnNft(args),
    setUnderlyingToken: (_: any, args: any) => setUnderlyingToken(args),
    mint: (_: any, args: any) => mintERC20(args),
    transfer: (_: any, args: any) => transferERC20(args),
    setBaseUri: (_: any, args: any) => setBaseUri(args),
    setContractURI: (_: any, args: any) => setContractURI(args),
    setPropertyNames: (_: any, args: any) => setPropertyNames(args),
    setPropertyValue: (_: any, args: any) => setPropertyValue(args),
    setDynamicSvg: (_: any, args: any) => setDynamicSvg(args),
    setTrustedForwarder: (_: any, args: any) => setTrustedForwarder(args),
    setApprovalForAll: (_: any, args: any) => setApprovalForAll(args),
    setUniqueSVG: (_: any, args: any) => setUniqueSVG(args),
    setTokenURI: (_: any, args: any) => setTokenURI(args),
    equipToken: (_: any, args: any) => equipToken(args),
    unequipToken: (_: any, args: any) => unequipToken(args),
    createFunction: (_: any, args: any) => receiveTransaction(args),
  },
}
