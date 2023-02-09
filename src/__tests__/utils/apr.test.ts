import BigNumber from 'bignumber.js'
import lpAprs from 'config/constants/lpAprs.json'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

jest.mock('../../config/constants/lpAprs.json', () => ({
	'0xfcb81CBBB8d74030A9C5BF24e0f61d6C4a734f2f': 0,
}))

// describe('getPoolApr', () => {
// 	it(`returns null when parameters are missing`, () => {
// 		const apr = getPoolApr(null, null, null, null)
// 		expect(apr).toBeNull()
// 	})
// 	it(`returns null when APR is infinite`, () => {
// 		const apr = getPoolApr(0, 0, 0, 0)
// 		expect(apr).toBeNull()
// 	})
// 	it(`get the correct pool APR`, () => {
// 		const apr = getPoolApr(10, 1, 100000, 1)
// 		expect(apr).toEqual(1051.2)
// 	})
// })

describe('getFarmApr', () => {
	it(`returns null when parameters are missing`, () => {
		const { asaRewardsApr, lpRewardsApr } = getFarmApr(null, null, null, null)
		expect(asaRewardsApr).toBeNull()
		expect(lpRewardsApr).toEqual(0)
	})
	it(`returns null when APR is infinite`, () => {
		const { asaRewardsApr, lpRewardsApr } = getFarmApr(BIG_ZERO, BIG_ZERO, BIG_ZERO, '')
		expect(asaRewardsApr).toBeNull()
		expect(lpRewardsApr).toEqual(0)
	})
	it(`get the correct pool APR`, () => {
		const { asaRewardsApr, lpRewardsApr } = getFarmApr(BIG_TEN, new BigNumber(1), new BigNumber(100000), '')
		expect(asaRewardsApr).toEqual(52560)
		expect(lpRewardsApr).toEqual(0)
	})
	it(`get the correct pool APR combined with LP APR`, () => {
		const { asaRewardsApr, lpRewardsApr } = getFarmApr(
			BIG_TEN,
			new BigNumber(1),
			new BigNumber(100000),
			'0xfcb81CBBB8d74030A9C5BF24e0f61d6C4a734f2f',
		)
		expect(asaRewardsApr).toEqual(52560)
		expect(lpRewardsApr).toEqual(lpAprs['0xfcb81CBBB8d74030A9C5BF24e0f61d6C4a734f2f'])
	})
})
