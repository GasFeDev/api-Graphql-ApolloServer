import axios from 'axios'
import { DocumentNode, print } from 'graphql'
import { gql } from 'apollo-server-express'
import { transaction } from '../sentryLogger'
import { getErrorMessage } from '../../util'
import { PostLoggerTXPayload } from './interfaces'
import * as dotenv from 'dotenv'

dotenv.config()

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || ''
const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': process.env.DGRAPH_KEY,
  },
}

export const createRawTransaction = async (
  createTxPayload: PostLoggerTXPayload
): Promise<any | null> => {
  try {
    const operationDoc = buildDoc(createTxPayload)
    console.log('DONE')
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response

    return data.addRawTransaction?.numUids
  } catch (error) {
    console.log('ERROR DGRAPH:', error)
    const reportError = getErrorMessage(error)
    transaction('DGRAPH', reportError)
  } finally {
    console.log('END DGRAPH')
  }
  return null
}

export const fetchGraphQL = async (
  operationDoc: DocumentNode,
  variables: object
) => {
  const body = {
    query: print(operationDoc),
    variables: variables,
  }
  console.log('GraphQL request body:', body)
  try {
    const response = await axios.post(graphqlEndpoint, body, config)
    const { data } = response
    console.log('GraphQL response:', data)
    return data
  } catch (error) {
    console.log('ERROR DGRAPH:', error)
    const reportError = getErrorMessage(error)
    transaction('DGRAPH', reportError)
    return null
  }
}

export const buildDoc = (txPayload: PostLoggerTXPayload) => {
  console.log(`mutation MyMutation {
      addRawTransaction(
        input: {
          confirm: "${txPayload.confirm}"
          description: "${txPayload.description}"
          from: "${txPayload.from}"
          nftType: "${txPayload.nftType}"
          to: "${txPayload.to}"
          txHash: "This is a Test"
          txType: "${txPayload.txType}"
          functionName: "${txPayload.functionName}"
          functionParams: "${txPayload.functionParams}"
          txId: "${txPayload.txId}"
        }
      ) {
        numUids
      }
    } `)
  const operationDoc = gql`
    mutation MyMutation {
      addRawTransaction(
        input: {
          confirm: "${txPayload.confirm}"
          description: "${txPayload.description}"
          from: "${txPayload.from}"
          nftType: "${txPayload.nftType}"
          to: "${txPayload.to}"
          txHash: "${txPayload.txHash?.replace(/\"/g, "'")}"
          txType: "${txPayload.txType}"
          functionName: "${txPayload.functionName}"
          functionParams: "${txPayload.functionParams?.replace(/\"/g, "'")}"
          txId: "${txPayload.txId}"
        }
      ) {
        numUids
      }
    }
  `
  console.log(operationDoc)
  return operationDoc
}
