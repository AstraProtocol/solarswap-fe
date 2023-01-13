import { SessionTypes } from '@walletconnect/sign-client/node_modules/@walletconnect/types/dist/types/index'
import type { Chain, EIP1193Provider, WalletInit } from '@web3-onboard/common'
import { ProviderAccounts } from '@web3-onboard/common/dist/types'
const { WalletConnectConnector } = require('@astra-sdk/walletconnect-connector')

interface Connector {
	session: SessionTypes.Struct
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
		url: string
		icons: string[]
	}
}

function astraConnectModule({ icon, rpcUrl, chainId, metadata, onAppDisconnect = () => {} }: Props): WalletInit {
	return () => {
		return {
			label: 'Astra Wallet',
			getIcon: async () => icon || '',
			getInterface: async ({ EventEmitter }: { chains: Chain[]; EventEmitter: any }) => {
				const { ProviderRpcError, ProviderRpcErrorCode } = await import('@web3-onboard/common')
				// const { default: WalletConnect } = await import('@walletconnect/client')
				const { RELAY_URL } = await require('@astra-sdk/wallet-connect')
				console.log(rpcUrl, chainId, ' aaa')
				const connector = new WalletConnectConnector({
					url: rpcUrl,
					chainId: chainId
				})
				await connector.setup({
					relayUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${RELAY_URL}`,
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

						// listen for disconnect event
						fromEvent(this.connector.client, 'session_delete', (error: any, payload: any) => {
							if (error) {
								throw error
							}

							return payload
						})
							.pipe(takeUntil(this.disconnected$))
							.subscribe({
								next: () => {
									typeof localStorage !== 'undefined' && localStorage.removeItem('walletconnect')
									onAppDisconnect()
									console.log('disconnect')
									this.emit('accountsChanged', [])
									// this.disconnected$.next(true)
								},
								error: () => {
									typeof localStorage !== 'undefined' && localStorage.removeItem('walletconnect')
									onAppDisconnect()
									this.emit('accountsChanged', [])
									// this.disconnected$.next(true)
								}
							})
						// listen for disconnect event
						fromEvent(this.connector.client, 'session_event', (error: any, payload: any) => {
							if (error) {
								throw error
							}

							return payload
						})
							.pipe(takeUntil(this.disconnected$))
							.subscribe({
								next: args => {
									console.log('change ee', args)
									// Handle session events, such as "chainChanged", "accountsChanged", etc.
								},
								error: console.warn
							})

						this.disconnect = () => this.connector.deactivate()

						this.request = async ({ method, params }) => {
							if (method === 'eth_chainId') {
								return `0x${chainId.toString(16)}`
							}

							if (method === 'eth_requestAccounts') {
								return new Promise<ProviderAccounts>(async (resolve, reject) => {
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
													message: 'User rejected the request.'
												})
											)
										}
									} else {
										this.emit('chainChanged', `0x${chainId.toString(16)}`)
										return resolve([this.connector.account])
									}
								})
							}

							if (method === 'wallet_switchEthereumChain' || method === 'eth_selectAccounts') {
								throw new ProviderRpcError({
									code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
									message: `The Provider does not support the requested method: ${method}`
								})
							}

							if (method === 'eth_accounts') {
								return [this.connector.account]
							}
							return this.connector.provider.request(method, params)
						}
					}
				}

				return {
					provider: new EthProvider({
						connector
					})
				}
			}
		}
	}
}

export default astraConnectModule
