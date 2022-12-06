/**
 * @fileoverview Tien 02/12/2022
 */
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from 'utils/providers'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import tokens from 'config/constants/tokens'

// Addresses
import {
	getAddress,
	getMasterChefAddress,
	getPointCenterIfoAddress,
	getClaimRefundAddress,
	getChainlinkOracleAddress,
	getMulticallAddress
} from 'utils/addressHelpers'

// ABI

import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'

import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'

// Types
import type {
	ChainlinkOracle,
	Erc20,
	Erc721,
	Masterchef,
	SousChef,
	SousChefV2,
	LpToken,
	ClaimRefund,
	Multicall,
	Erc721collection,
	PointCenterIfo
} from 'config/abi/types'

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
	const signerOrProvider = signer ?? simpleRpcProvider
	return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
	return getContract(bep20Abi, address, signer) as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
	return getContract(erc721Abi, address, signer) as Erc721
}
export const getLpContract = (address: string, signer?: Signer | Provider) => {
	return getContract(lpTokenAbi, address, signer) as LpToken
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
	const config = poolsConfig.find(pool => pool.sousId === id)
	const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
	return getContract(abi, getAddress(config.contractAddress), signer) as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
	const config = poolsConfig.find(pool => pool.sousId === id)
	return getContract(sousChefV2, getAddress(config.contractAddress), signer) as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
	return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer) as PointCenterIfo
}

export const getMasterchefContract = (signer?: Signer | Provider) => {
	return getContract(masterChef, getMasterChefAddress(), signer) as Masterchef
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
	return getContract(claimRefundAbi, getClaimRefundAddress(), signer) as ClaimRefund
}

export const getChainlinkOracleContract = (signer?: Signer | Provider) => {
	return getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), signer) as ChainlinkOracle
}
export const getMulticallContract = () => {
	return getContract(MultiCallAbi, getMulticallAddress(), simpleRpcProvider) as Multicall
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
	return getContract(erc721CollectionAbi, address, signer) as Erc721collection
}
