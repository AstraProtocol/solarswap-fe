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
  const wAsaAddress = tokens.wasa.address
  const firstPart = !quoteTokenAddress || quoteTokenAddress === wAsaAddress ? 'ASA' : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wAsaAddress ? 'ASA' : tokenAddress
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
