import { PostLoggerTXPayload, UpdateLoggerTXPayload } from "./interfaces";
const BASE_OBJECT = {
    baseUri: "",
    confirm: 0,
    contractAddress: "",
    contractUri: "",
    decodeData: [],
    errors: "",
    description: "",
    from: "",
    isOnChainMD: false,
    maxSupply: 0,
    message: "",
    name: "",
    nftType: "",
    owner: "",
    propertiesName: [],
    propertiesValues: [],
    isERC20: false,
    rawSimulationTx: "",
    svgProperty: "",
    symbol: "",
    to: "",
    amount: 0,
    tokenId: 0,
    tokenNFTAddress: "",
    txHash: "",
    txType: "",
};

export const payloadBuilder = (payload: any): PostLoggerTXPayload => {

    const newObject = {
        ...BASE_OBJECT,
        ...payload
    };

    return newObject;

}