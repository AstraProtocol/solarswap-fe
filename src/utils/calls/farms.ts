import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { Masterchef } from 'config/abi/types'
import getGasPrice from 'utils/getGasPrice'

const options = {
	gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract: Masterchef, pid, amount) => {
	const gasPrice = getGasPrice()
	const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
	if (pid === 0) {
		return masterChefContract.enterStaking(value, { ...options, gasPrice })
	}

	return masterChefContract.deposit(pid, value, { ...options, gasPrice })
}

export const unstakeFarm = async (masterChefContract: Masterchef, pid, amount) => {
	const gasPrice = getGasPrice()
	const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
	if (pid === 0) {
		return masterChefContract.leaveStaking(value, { ...options, gasPrice })
	}

	return masterChefContract.withdraw(pid, value, { ...options, gasPrice })
}

export const harvestFarm = async (masterChefContract: Masterchef, pid) => {
	const gasPrice = getGasPrice()
	if (pid === 0) {
		return masterChefContract.leaveStaking('0', { ...options, gasPrice })
	}

	return masterChefContract.deposit(pid, '0', { ...options, gasPrice })
}
