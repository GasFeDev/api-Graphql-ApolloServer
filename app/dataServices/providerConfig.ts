import * as dotenv from "dotenv";
dotenv.config();

export interface Provider {
  name: string;
  network: string;
  networkApi: string;
  ethereumNodeUrl: string;
  chainId: number;
  relayUrl: string;
  relayKey: string;
  relaySecret: string;
  factoryAddress: string;
  factoryERC20Address: string
  paymasterAddress: string;
  apiAddress: string;
  apiAddressKey: string;
  forwarder: string;
}

const providerList: Provider[] = [
  {
    name: "mumbai",
    network: "mumbai",
    networkApi: process.env.INFURA_API_KEY || "",
    ethereumNodeUrl: process.env.ETH_NODE_URL || "",
    chainId: 80001,
    relayUrl: process.env.GSN_REALAY_ENDPOINT || "",
    relayKey: process.env.GSN_RELAY_SIGNING_KEY || "",
    relaySecret: process.env.GSN_RELAY_SECRET || "",
    apiAddress: process.env.API_ADDRESS || "",
    apiAddressKey: process.env.API_ADDRESS_KEY || "",
    factoryAddress: process.env.FACTORY_ADDRESS || "",
    factoryERC20Address: process.env.FACTORY_ERC20_ADDRESS || "",
    paymasterAddress: process.env.PAYMASTER || "",
    forwarder: process.env.FORWARDER || ""
  },
];


export const getProvider = (name: string) => {
  const provider = providerList.find(
    (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
  );
  return provider || providerList[0];
};
