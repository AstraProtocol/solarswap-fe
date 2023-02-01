// Set of helper functions to facilitate wallet setup

import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from '@solarswap/sdk'
import { BASE_URL, BASE_ASTRA_EXPLORER_URLS } from 'config'
import { CHAIN_ID } from 'config/constants/networks'
import { nodes } from './getRpcUrl'

const NETWORK_CONFIG = {
	[ChainId.MAINNET]: {
		name: 'Astra Blockchain Mainnet',
		scanURL: BASE_ASTRA_EXPLORER_URLS[ChainId.MAINNET],
	},
	[ChainId.TESTNET]: {
		name: 'Astra Blockchain Testnet',
		scanURL: BASE_ASTRA_EXPLORER_URLS[ChainId.TESTNET],
	},
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (externalProvider?: ExternalProvider) => {
	const provider = externalProvider || window.ethereum
	const chainId = parseInt(CHAIN_ID, 10) as keyof typeof NETWORK_CONFIG
	if (!NETWORK_CONFIG[chainId]) {
		console.error('Invalid chain id')
		return false
	}
	if (provider) {
		try {
			await provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: `0x${chainId.toString(16)}` }],
			})
			return true
		} catch (switchError) {
			if ((switchError as any)?.code === 4902) {
				try {
					await provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: `0x${chainId.toString(16)}`,
								chainName: NETWORK_CONFIG[chainId].name,
								nativeCurrency: {
									name: 'Astra',
									symbol: 'asa',
									decimals: 18,
								},
								rpcUrls: nodes,
								blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
							},
						],
					})
					return true
				} catch (error) {
					console.error('Failed to setup the network in Metamask:', error)
					return false
				}
			}
			return false
		}
	} else {
		console.error("Can't setup the Astra network on metamask because window.ethereum is undefined")
		return false
	}
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
	const tokenAdded = await window.ethereum.request({
		method: 'wallet_watchAsset',
		params: {
			type: 'ERC20',
			options: {
				address: tokenAddress,
				symbol: tokenSymbol,
				decimals: tokenDecimals,
				image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
			},
		},
	})

	return tokenAdded
}

export class WalletHelper {
	static cacheName = 'connectedWallets'

	static saveCacheConnect(connectedWallets: string[]) {
		window.localStorage.setItem(WalletHelper.cacheName, JSON.stringify(connectedWallets))
	}

	static removeCacheConnect() {
		window.localStorage.setItem(WalletHelper.cacheName, '')
	}
	static getCacheConnect() {
		const walletNames = window.localStorage.getItem(WalletHelper.cacheName)
		if (walletNames) {
			return JSON.parse(walletNames)
		}
		return ''
	}
}

export const connectorLocalStorageKey = 'connectorIdv2'
export const walletLocalStorageKey = 'wallet'
