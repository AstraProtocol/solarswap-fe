/**
 * @fileoverview Tien 04/12/2022
 */
import { Token } from '@solarswap/sdk'
import tokens from 'config/constants/tokens'

const { bondly, safemoon, itam, ccar, bttold } = tokens

interface WarningTokenList {
	[key: string]: Token
}

/**
 * @example safemoon token
 */
const SwapWarningTokens = <WarningTokenList>{
	// safemoon,
}

export default SwapWarningTokens
