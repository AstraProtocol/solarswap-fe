import type { Chain, EIP1193Provider, WalletInit } from '@web3-onboard/common'
import { ProviderAccounts } from '@web3-onboard/common/dist/types'
import { AstraWalletConnector } from '@astra-sdk/connector'
interface Connector {
	client: any
	provider: any
	account?: string
	chainId?: string
	activate: () => Promise<{ account: string; chainId: string }>
	deactivate: () => Promise<void>
}

interface Props {
	title?: string
	icon?: string
	chainId: number
	rpcUrl: string
	onAppDisconnect?: () => void
	metadata: {
		name: string
		description: string
		location: string
		icon: string
	}
}

function astrainjectedModule({ icon, rpcUrl, chainId, metadata, onAppDisconnect = () => {} }: Props): WalletInit {
	return () => {
		return {
			label: 'Astra Inject',
			getIcon: async () => icon || '',
			getInterface: async ({ EventEmitter }: { chains: Chain[]; EventEmitter: any }) => {
				const { ProviderRpcError, ProviderRpcErrorCode } = await import('@web3-onboard/common')
				// const { default: WalletConnect } = await import('@walletconnect/client')
				const connector = await AstraWalletConnector.create({
					url: rpcUrl,
					chainId: chainId,
					metadata
				})

				const { Subject, fromEvent } = await import('rxjs')
				const { takeUntil } = await import('rxjs/operators')

				const emitter = new EventEmitter()

				class EthProvider {
					public request: any // EIP1193Provider['request']
					public connector: Connector
					public addresses?: ProviderAccounts
					public disconnect: EIP1193Provider['disconnect']
					public emit: typeof EventEmitter['emit']
					public on: typeof EventEmitter['on']
					public removeListener: typeof EventEmitter['removeListener']

					private disconnected$: InstanceType<typeof Subject>

					constructor({ connector }: { connector: Connector }) {
						this.emit = emitter.emit.bind(emitter)
						this.on = emitter.on.bind(emitter)
						this.removeListener = emitter.removeListener.bind(emitter)

						this.disconnected$ = new Subject()
						this.connector = connector

						this.disconnect = () => this.connector.deactivate()

						this.request = async ({ method, params }) => {
							// JSON.stringify({method, params}))
							if (method === 'eth_chainId') {
								return `0x${chainId.toString(16)}`
							}

							if (method === 'eth_requestAccounts') {
								const account = new Promise<ProviderAccounts>(async (resolve, reject) => {
									// Check if connection is already established
									if (!this.connector.account) {
										try {
											const { account } = await this.connector.activate()
											this.emit('accountsChanged', account)
											this.emit('chainChanged', `0x${chainId.toString(16)}`)
											resolve([this.connector.account || ''] || [])
										} catch (e) {
											onAppDisconnect()
											reject(
												new ProviderRpcError({
													code: 4001,
													message: 'User rejected the request.',
												}),
											)
										}
									} else {
										this.emit('chainChanged', `0x${chainId.toString(16)}`)
										return resolve([this.connector.account])
									}
								})
								const res = await account;
								return res;
							}

							if (method === 'wallet_switchEthereumChain' || method === 'eth_selectAccounts') {
								throw new ProviderRpcError({
									code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
									message: `The Provider does not support the requested method: ${method}`,
								})
							}

							if (method === 'eth_accounts') {
								return [this.connector.account]
							}
							const result = await this.connector.provider.request(method, params);
							return result
						}
					}
				}

				return {
					provider: new EthProvider({
						connector,
					}),
				}
			},
		}
	}
}

export default astrainjectedModule
