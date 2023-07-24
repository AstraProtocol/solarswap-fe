import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
	const address = {
		11110: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
		11115: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe'
	}

	it(`get address for mainnet (chainId 11110)`, () => {
		process.env.NEXT_PUBLIC_CHAIN_ID = '11110'
		const expected = address[11110]
		expect(getAddress(address)).toEqual(expected)
	})
	it(`get address for testnet (chainId 11115)`, () => {
		process.env.NEXT_PUBLIC_CHAIN_ID = '11115'
		const expected = address[11115]
		expect(getAddress(address)).toEqual(expected)
	})
	it(`get address for any other network (chainId 31337)`, () => {
		process.env.NEXT_PUBLIC_CHAIN_ID = '31337'
		const expected = address[11110]
		expect(getAddress(address)).toEqual(expected)
	})
})
