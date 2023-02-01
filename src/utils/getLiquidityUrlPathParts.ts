// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import tokens from 'config/constants/tokens'

const getLiquidityUrlPathParts = ({
	quoteTokenAddress,
	tokenAddress,
}: {
	quoteTokenAddress: string
	tokenAddress: string
}): string => {
	const wasaAddress = tokens.wasa.address
	const firstPart = !quoteTokenAddress || quoteTokenAddress === wasaAddress ? 'ASA' : quoteTokenAddress
	const secondPart = !tokenAddress || tokenAddress === wasaAddress ? 'ASA' : tokenAddress
	return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
