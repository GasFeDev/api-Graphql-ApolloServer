import { RelayProvider, NpmLogLevel } from '@opengsn/provider'
import { getProvider } from './dataServices/providerConfig'
import * as dotenv from 'dotenv'
import { ethers } from 'ethers'

const Web3HttpProvider = require('web3-providers-http')
dotenv.config()

export interface Provider {
  name: string
  network: string
  ethereumNodeUrl: string
  chainId: number
  relayUrl: string
  relayKey: string
  relaySecret: string
  factoryAddress: string
  factoryERC20Address: string
  paymasterAddress: string
  forwarder: string
}

export async function getGSNProvider(
  name: string,
  logType: NpmLogLevel = 'debug'
): Promise<
  {
    gsnProvider: RelayProvider
    gsnSigner: ethers.providers.JsonRpcSigner
    etherProvider: ethers.providers.Web3Provider
  } & ReturnType<typeof getProvider>
> {
  const provider = getProvider(name)
  const {
    paymasterAddress,
    relayUrl,
    ethereumNodeUrl,
    apiAddress,
    apiAddressKey,
  } = provider

  console.log(
    `\n paymasterAddress - ${paymasterAddress} \n relayUrl - ${relayUrl}`
  )
  const config = {
    paymasterAddress: paymasterAddress,
    preferredRelays: [relayUrl],
    performDryRunViewRelayCall: false,
    minMaxPriorityFeePerGas: 91426781202,

    gasPriceFactorPercent: 2,
    loggerConfiguration: {
      logLevel: logType,
    },
  }

  const web3provider = new Web3HttpProvider(ethereumNodeUrl)

  const gsnProvider = await RelayProvider.newProvider({
    provider: web3provider,
    config,
  }).init()
  // console.log("provider", gsnProvider.host, gsnProvider.relayClient.config);

  // Get Account data as signer
  await gsnProvider.addAccount(apiAddressKey)

  if (!gsnProvider) {
    throw new Error('GSN Provider not found')
  }

  const etherProvider = new ethers.providers.Web3Provider(
    // @ts-ignore
    gsnProvider
  )
  const gsnSigner = await etherProvider.getSigner(apiAddress)

  return { gsnProvider, gsnSigner, ...provider, etherProvider }
}
