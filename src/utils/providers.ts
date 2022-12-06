/**
 * @fileoverview Tien 02/12/2022
 */
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL)

export default null
