import { ZAP_ADDRESS } from 'config/constants'
import { CHAIN_ID } from 'config/constants/networks'
import { useZapContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

function useZapInAmount(tokenA: string, tokenB: string, pool: string, userIn: string): [string, string] {
	const zapInContract = useZapContract(ZAP_ADDRESS[CHAIN_ID], false)

	const { result } = useSingleCallResult(zapInContract, 'calculateZapInAmounts', [
		tokenA,
		tokenB,
		pool,
		userIn === '0' ? undefined : userIn, // https://github.com/AstraProtocol/astra-defi-fe/issues/12
	])
	if (result) {
		const [tokenInAmount, tokenOutAmount] = result
		return [tokenInAmount?.toString() || '0', tokenOutAmount?.toString() || '0']
	}
	return ['', '']
}

export default useZapInAmount
