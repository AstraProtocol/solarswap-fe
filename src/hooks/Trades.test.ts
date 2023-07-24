import { renderHook } from '@testing-library/react-hooks'
import { testnetTokens } from 'config/constants/tokens'
import { createWrapper } from 'testUtils'
import { Pair, TokenAmount, CurrencyAmount, Trade } from '@solarswap/sdk'
import { PairState, usePairs, usePair } from './usePairs'
import { useAllCommonPairs, useTradeExactIn, useTradeExactOut, useIsTransactionUnsupported } from './Trades'

const Trades = { useAllCommonPairs, useTradeExactIn, useTradeExactOut, useIsTransactionUnsupported }
const UsePairs = { usePairs, usePair }

describe('Trade', () => {
	test.todo('Add test back')
	// describe('#useAllCommonPairs', () => {
	// 	const mockUsePairs = jest.spyOn(UsePairs, 'usePairs')
	// 	it('should filter only exist Pair', () => {
	// 		mockUsePairs.mockReturnValue([
	// 			[
	// 				PairState.EXISTS,
	// 				new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 			],
	// 			[
	// 				PairState.INVALID,
	// 				new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.usdt, '1')),
	// 			],
	// 			[
	// 				PairState.LOADING,
	// 				new Pair(new TokenAmount(testnetTokens.usdt, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 			],
	// 			[PairState.EXISTS, null],
	// 		])

	// 		const { result } = renderHook(() => {
	// 			const pairs = Trades.useAllCommonPairs(testnetTokens.wasa, testnetTokens.wasa)
	// 			return {
	// 				pairs,
	// 			}
	// 		})

	// 		expect(result.current.pairs).toStrictEqual([
	// 			new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 		])
	// 	})
	// 	it('should filter out duplicated Pair', () => {
	// 		mockUsePairs.mockReturnValue([
	// 			[
	// 				PairState.EXISTS,
	// 				new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 			],
	// 			[
	// 				PairState.EXISTS,
	// 				new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 			],
	// 			[
	// 				PairState.EXISTS,
	// 				new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 			],
	// 			[PairState.EXISTS, null],
	// 		])

	// 		const { result } = renderHook(() => {
	// 			const pairs = Trades.useAllCommonPairs(testnetTokens.wasa, testnetTokens.wasa)
	// 			return {
	// 				pairs,
	// 			}
	// 		})

	// 		expect(result.current.pairs).toStrictEqual([
	// 			new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 		])
	// 	})

	// 	it('should get all pair combinations wasa, wasa', () => {
	// 		mockUsePairs.mockClear()
	// 		renderHook(() => {
	// 			Trades.useAllCommonPairs(testnetTokens.wasa, testnetTokens.wasa)
	// 		})

	// 		expect(mockUsePairs).toMatchSnapshot()
	// 	})

	// 	it('should get all pair combinations, wasa, wasa', () => {
	// 		mockUsePairs.mockClear()
	// 		renderHook(() => {
	// 			Trades.useAllCommonPairs(testnetTokens.wasa, testnetTokens.wasa)
	// 		})

	// 		expect(mockUsePairs).toMatchSnapshot()
	// 	})
	// })

	// describe('#useTradeExactIn/Out', () => {
	// 	const mockUseAllCommonPairs = jest.spyOn(Trades, 'useAllCommonPairs')
	// 	const mockTradeExactIn = jest.spyOn(Trade, 'bestTradeExactIn')
	// 	const mockTradeExactOut = jest.spyOn(Trade, 'bestTradeExactOut')

	// 	it('should call with maxHops 1 with singleHopOnly', () => {
	// 		const allowPairs = [
	// 			new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 		]
	// 		const argA = CurrencyAmount.ether('1000000')
	// 		const argB = testnetTokens.wasa
	// 		renderHook(
	// 			() => {
	// 				mockUseAllCommonPairs.mockReturnValue(allowPairs)
	// 				Trades.useTradeExactIn(argA, argB)
	// 			},
	// 			{
	// 				wrapper: createWrapper({ user: { userSingleHopOnly: true } }),
	// 			},
	// 		)

	// 		expect(mockTradeExactIn).toBeCalledWith(allowPairs, argA, argB, { maxHops: 1, maxNumResults: 1 })
	// 		mockTradeExactIn.mockClear()

	// 		renderHook(
	// 			() => {
	// 				mockUseAllCommonPairs.mockReturnValue(allowPairs)
	// 				Trades.useTradeExactOut(argB, argA)
	// 			},
	// 			{
	// 				wrapper: createWrapper({ user: { userSingleHopOnly: true } }),
	// 			},
	// 		)

	// 		expect(mockTradeExactOut).toBeCalledWith(allowPairs, argB, argA, { maxHops: 1, maxNumResults: 1 })
	// 		mockTradeExactOut.mockClear()
	// 	})

	// 	it('should call with 3 times without singleHopOnly', () => {
	// 		const allowPairs = [
	// 			new Pair(new TokenAmount(testnetTokens.wasa, '1'), new TokenAmount(testnetTokens.wasa, '1')),
	// 		]
	// 		const argA = CurrencyAmount.ether('1000000')
	// 		const argB = testnetTokens.wasa
	// 		renderHook(
	// 			() => {
	// 				mockUseAllCommonPairs.mockReturnValue(allowPairs)
	// 				Trades.useTradeExactIn(argA, argB)
	// 			},
	// 			{
	// 				wrapper: createWrapper({ user: { userSingleHopOnly: false } }),
	// 			},
	// 		)

	// 		renderHook(
	// 			() => {
	// 				mockUseAllCommonPairs.mockReturnValue(allowPairs)
	// 				Trades.useTradeExactOut(argB, argA)
	// 			},
	// 			{
	// 				wrapper: createWrapper({ user: { userSingleHopOnly: false } }),
	// 			},
	// 		)

	// 		expect(mockTradeExactOut).toBeCalledTimes(3)
	// 		mockTradeExactOut.mockClear()
	// 	})
	// })
})
