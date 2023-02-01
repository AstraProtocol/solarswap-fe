import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { CHAIN_ID } from './networks'
import tokens, { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

export const vaultPoolConfig = {
	[VaultKey.CakeVault]: {
		name: <Trans>Auto ASA</Trans>,
		description: <Trans>Automatic restaking</Trans>,
		autoCompoundFrequency: 5000,
		gasLimit: 380000,
		tokenImage: {
			primarySrc: `/images/tokens/${tokens.wasa.address}.svg`,
			secondarySrc: '/images/tokens/autorenew.svg',
		},
	},
} as const

const pools: SerializedPoolConfig[] = [
	{
		sousId: 0,
		stakingToken: serializedTokens.wasa,
		earningToken: serializedTokens.wasa,
		contractAddress: {
			11115: '0x47862AD34a6DC10d0dB988E56Ae8fE36818540Dc',
			56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
		},
		poolCategory: PoolCategory.CORE,
		harvest: true,
		tokenPerBlock: '10',
		sortOrder: 1,
		isFinished: false,
	},
].filter(p => !!p.contractAddress[CHAIN_ID])

export default pools
