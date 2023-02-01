import { InjectedConnector } from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ChainId } from '@solarswap/sdk'
// import { BscConnector } from '@binance-chain/bsc-connector'
import { hexlify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import { Web3Provider } from '@ethersproject/providers'
import { CHAIN_ID } from 'config/constants/networks'
import { AstraWalletConnector } from '@astra-sdk/connector'
import { WalletConnectConnector } from '@astra-sdk/walletconnect-connector'
import { WALLET_CONNECT_RELAY } from 'config'
import getNodeUrl from './getRpcUrl'
import { ConnectorNames } from 'config/constants'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(CHAIN_ID, 10)

export const injected = new InjectedConnector({ supportedChainIds: [chainId] })

// const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const walletconnector = new WalletConnectConnector({
	url: rpcUrl,
	chainId,
})
export const connectorsByName = {
	[ConnectorNames.Injected]: injected,
	[ConnectorNames.AstraConnect]: async () => {
		await walletconnector.setup({
			relayUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${WALLET_CONNECT_RELAY}`,
			metadata: {
				name: 'Solar Swap',
				description: 'Swap, earn and win ASA through yield farming on the first DEFI exchange for Astra token.',
				url: window.location.origin,
				icons: ['https://salt.tikicdn.com/ts/ta/8e/80/26/80c694f8ce25376dd97aa55d251a459f.png'],
			},
		})
		return walletconnector
	},
	[ConnectorNames.AstraWallet]: () => {
		return AstraWalletConnector.create({ chainId, url: rpcUrl })
	},
	// [ConnectorNames.BSC]: bscConnector,
	// [ConnectorNames.Blocto]: async () => {
	// 	const { BloctoConnector } = await import("@blocto/blocto-connector");
	// 	return new BloctoConnector({ chainId, rpc: rpcUrl });
	// },
	// [ConnectorNames.WalletLink]: async () => {
	// 	const { WalletLinkConnector } = await import('@web3-react/walletlink-connector')
	// 	return new WalletLinkConnector({
	// 		url: rpcUrl,
	// 		appName: 'SolarSwap',
	// 		appLogoUrl: 'https://salt.tikicdn.com/ts/ta/8e/80/26/80c694f8ce25376dd97aa55d251a459f.png',
	// 		supportedChainIds: [ChainId.MAINNET, ChainId.TESTNET]
	// 	})
	// },
} as const

export const getLibrary = (provider): Web3Provider => {
	const library = new Web3Provider(provider)
	library.pollingInterval = POLLING_INTERVAL
	return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
	connector: AbstractConnector,
	provider: any,
	account: string,
	message: string,
): Promise<string> => {
	// if (window.BinanceChain && connector instanceof BscConnector) {
	// 	const { signature } = await window.BinanceChain.bnbSign(account, message)
	// 	return signature
	// }

	/**
	 * Wallet Connect does not sign the message correctly unless you use their method
	 * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
	 */
	if (provider.provider?.wc) {
		const wcMessage = hexlify(toUtf8Bytes(message))
		const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
		return signature
	}

	return provider.getSigner(account).signMessage(message)
}
