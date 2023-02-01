import { parseUnits } from '@ethersproject/units'
import { createStore, Store } from 'redux'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import { updateVersion } from '../global/actions'
import { updateGasPrice } from './actions'
import { GAS_PRICE } from './hooks/helpers'
import reducer, { initialState, UserState } from './reducer'

describe('swap reducer', () => {
	let store: Store<UserState>

	beforeEach(() => {
		store = createStore(reducer, initialState)
	})

	describe('updateVersion', () => {
		it('has no timestamp originally', () => {
			expect(store.getState().lastUpdateVersionTimestamp).toBeUndefined()
		})
		it('sets the lastUpdateVersionTimestamp', () => {
			const time = new Date().getTime()
			store.dispatch(updateVersion())
			expect(store.getState().lastUpdateVersionTimestamp).toBeGreaterThanOrEqual(time)
		})
		it('sets allowed slippage and deadline', () => {
			store = createStore(reducer, {
				...initialState,
				userDeadline: undefined,
				userSlippageTolerance: undefined,
			} as any)
			store.dispatch(updateVersion())
			expect(store.getState().userDeadline).toEqual(DEFAULT_DEADLINE_FROM_NOW)
			expect(store.getState().userSlippageTolerance).toEqual(INITIAL_ALLOWED_SLIPPAGE)
		})
	})

	describe('updateGasPrice', () => {
		it('gasPrice is default', () => {
			expect(store.getState().gasPrice).toEqual(parseUnits(GAS_PRICE.default, 'gwei').toString())
		})
		it('gasPrice is fast after update', () => {
			store.dispatch(updateGasPrice({ gasPrice: '11000000000000' }))
			expect(store.getState().gasPrice).toEqual(parseUnits(GAS_PRICE.fast, 'gwei').toString())
		})
	})
})
