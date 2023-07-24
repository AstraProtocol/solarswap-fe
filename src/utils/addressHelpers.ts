import { ChainId } from '@solarswap/sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'
import { VaultKey } from 'state/types'

export const getAddress = (address: Address): string => {
	const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
	return address[CHAIN_ID] ? address[CHAIN_ID] : address[ChainId.MAINNET]
}

export const getMasterChefAddress = () => {
	return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
	return getAddress(addresses.multiCall)
}
export const getLotteryV2Address = () => {
	return getAddress(addresses.lotteryV2)
}
export const getClaimRefundAddress = () => {
	return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
	return getAddress(addresses.pointCenterIfo)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
	if (!vaultKey) {
		return null
	}
	return getAddress(addresses[vaultKey])
}

export const getChainlinkOracleAddress = () => {
	return getAddress(addresses.chainlinkOracle)
}
