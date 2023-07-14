import { ethers } from 'ethers';
import { NO_TX_FOUND } from "./constants/txError";
import { E_INTERNAL_SERVER, E_FATAL_SERVER } from "./constants/txError";
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function crashProvider(error: unknown) {
  const errorString = getErrorMessage(error);
  return (
    errorString.indexOf(E_INTERNAL_SERVER) !== -1 ||
    errorString.indexOf(E_FATAL_SERVER) !== -1
  );
}

export function decoder(data: any, logIndex: number,) {
  //function to decode data from transactions
  const filterLog = data.logs.find((item: { logIndex: number }) => item.logIndex === logIndex);
  const decode = ethers.utils.defaultAbiCoder.decode(
    ['address', 'address'],
    filterLog.data
  );

  return [...decode];
}

export function findTxHash(logIndex: number, logs?: any[],) {
  const filterLog = logs?.find((item: { logIndex: number }) => item.logIndex === logIndex);

  return filterLog?.transactionHash || NO_TX_FOUND;
}
