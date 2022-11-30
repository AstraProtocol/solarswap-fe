import { Contract } from '@ethersproject/contracts'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import ZapInContract from 'config/abi/ZapIn.json'
import ISolardexRouter02ABI from 'config/abi/IPancakeRouter02.json'
import { ISolardexRouter02 } from 'config/abi/types/ISolardexRouter02'
import { CHAIN_ID } from 'config/constants/networks'
import { JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@solarswap/sdk'
import { ZAPIN_ADDRESS, ROUTER_ADDRESS } from '../config/constants'
import { BASE_ASTRA_EXPLORER_URLS } from '../config'
import { TokenAddressMap } from '../state/lists/hooks'
import { simpleRpcProvider } from './providers'
import { ZapIn } from '../config/abi/types'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getAstraScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || CHAIN_ID
  switch (type) {
    case 'transaction': {
      return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/address/${data}`
    }
  }
}

export function getAstraScanLinkForNft(collectionAddress: string, tokenId: string): string {
  const chainId = CHAIN_ID
  return `${BASE_ASTRA_EXPLORER_URLS[chainId]}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, signer?: Signer | Provider): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signer ?? simpleRpcProvider)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string) {
  return getContract(
    ROUTER_ADDRESS[CHAIN_ID],
    ISolardexRouter02ABI,
    getProviderOrSigner(library, account),
  ) as ISolardexRouter02
}

export function getZapInContract(_: number, library: Web3Provider, account?: string) {
  return getContract(ZAPIN_ADDRESS[CHAIN_ID], ZapInContract, getProviderOrSigner(library, account)) as ZapIn
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}
