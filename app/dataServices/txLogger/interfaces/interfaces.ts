export const TXInterface = {}

export type PropertyInput = {
  name: string
  value: string
}

export type DataNftContract = {
  name?: string | null
  symbol?: string | null
  contractURI?: string | null
  baseURI?: string | null
  maxSupply?: number
  owner?: string | null
  forwarder?: string | null
  isMultisign?: boolean
  isComposable?: boolean
  isEvolutionary?: boolean
  isMetadataOnChain?: boolean
  evolutionaryProperties?: PropertyInput[]
}
export interface PostLoggerTXPayload {
  txType?: string | null
  txHash?: string | null
  from?: string | null
  to?: string | null
  amount?: number
  contractAddress?: string | null
  message?: string | null
  confirm: number
  description?: string | null
  baseUri?: string | null
  _tokenURI?: string | null
  contractUri?: string | null
  decodeData?: any[]
  errors?: string | null
  isOnChainMD?: boolean
  isERC20?: boolean
  maxSupply?: number
  name?: string | null
  nftType?: string | null
  owner?: string | null
  propertiesName?: []
  propertiesValues?: []
  rawSimulationTx?: string | null
  svgProperty?: string | null
  symbol?: string | null
  tokenId?: number
  tokenNFTAddress?: string | null
  _properties?: PropertyInput[] | null
  trustedForWarder?: string | null
  dynamicSVG?: string | null
  uniqueSVG?: []
  approvalForAll?: []
  tokenURI?: []
  _dynamicSVG?: string | null
  data?: DataNftContract
  _destinationNFT?: number
  _tokenId?: number
  _amount?: number
  functionName?: string
  functionParams?: string
  txId?: string
  c_name?: string | null
}

export interface PostMintNftTxPayload {
  id?: string
  to: string | null
  tokenAddress: string | null
  tokenId?: number
  type: string | null
  _properties?: PropertyInput[] | null
  _tokenURI?: string | null
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
}

export interface PostCreateCollectionNftTxPayload {
  id?: string
  contractAddress: string | null
  data: {
    baseURI: string | null
    contractURI: string | null
    evolutionaryProperties?: PropertyInput[] | null
    forwarder: string | null
    owner: string | null
    isComposable: boolean | null | undefined
    isDynamic?: boolean | null | undefined
    isImmutable?: boolean | null | undefined
    isEvolutionary: boolean | null | undefined
    isMetadataOnChain: boolean | null | undefined
    isMultisign: boolean | null | undefined
    maxSupply: number | null
    name: string | null
    symbol: string | null
  }
  _nftType: string | null
  _dynamicSVG?: string | null
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
}

export interface PostBurnNftTxPayload {
  id?: string
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
  tokenId?: number
  contractAddress: string | null
  type: string | null
}

export interface PostBurnErc20TxPayload {
  amount: number | null
  contractAddress: string | null
}

export interface PostTransferErc20TxPayload {   
  tokenAddress: string | null;
  to: string | null; 
  amount: number | null;   
};

export interface PostMethodCallPayload {
  id?: string
  _newSvg?: string | null
  tokenId?: number | null
  _uniqueSVG?: string | null
  _tokenId?: number | null
  _tokenURI?: string | null
  _tokenOwnerSign?: number | null
  _uri?: string | null
  _forwarder?: string | null
  contractAddress?: string | null
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
}

export interface PosttransferNftTxPayload {
  id?: string
  contractAddress: string | null
  tokenId: number
  to: string | null
  type: string | null
  from: string | null
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
}

export interface PostEquipTokenTXPayload {
  id?: string
  contractAddress: string | null
  _tokenAddress: string | null
  _destinationNFT: number
  _tokenId: number
  _amount: number
  type: string | null
  confirm?: number | null
  message?: string | null
  decodeData?: any[] | null
}

export interface PostCreateErc20TxPayload {
  id?: string
  message?: string | null
  confirm?: number | null
  txType?: string | null
  txHash?: string | null
  name_: string | null
  symbol_: string | null
  decimals_: string | null
  maxSupply_: number | null
  owner_: string | null
  factoryERC20Address: string | null
}

export interface PostMintErc20TxPayload {
  txType?: string | null
  txHash?: string | null
  contractAddress: string | null
  account: string | null
  amount: number | null
}

export interface UpdateLoggerTXPayload {
  id: string
  txType?: string | null
  txHash?: string | null
  from?: string | null
  to?: string | null
  amount?: number | null
  contractAddress?: string | null
  message?: string | null
  confirm: number | null
  description?: string | null
  baseUri?: string | null
  contractUri?: string | null
  decodeData?: any[] | null
  errors?: string | null
  isOnChainMD?: boolean | null
  isERC20?: boolean | null
  maxSupply?: number | null
  name?: string | null
  nftType?: string | null
  owner?: string | null
  propertiesName?: []
  propertiesValues?: []
  rawSimulationTx?: string | null
  svgProperty?: string | null
  symbol?: string | null
  tokenId?: number | null
  tokenNFTAddress?: string | null
  _properties?: PropertyInput[] | null
  trustedForWarder?: string | null
  dynamicSVG?: string | null
  uniqueSVG?: []
  approvalForAll?: []
  tokenURI?: []
  _dynamicSVG?: string | null
  data?: DataNftContract
  _destinationNFT?: number
  _tokenId?: number
  _amount?: number
}