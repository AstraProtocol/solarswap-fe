import { NormalButton, Row } from '@astraprotocol/astra-ui'
import { Token } from '@solarswap/sdk'
import clsx from 'clsx'
import { CurrencyLogo } from 'components/Logo'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { CHAIN_ID } from 'config/constants/networks'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { subgraphTokenName, subgraphTokenSymbol } from 'state/info/constant'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'

const TokenInfoHeader = ({ tokenData, address }) => {
	const token = new Token(parseInt(CHAIN_ID), address, 18, '')
	const { isXs, isSm } = useMatchBreakpoints()
	const { t } = useTranslation()
	return (
		<Row className="flex-justify-space-between">
			<div className="margin-bottom-sm">
				<Row className="flex-align-center">
					<CurrencyLogo size={32} currency={token} />
					<span
						className={clsx('text text-bold margin-left-sm text-2xl', {
							['text-lg']: isXs || isSm,
						})}
						id="info-token-name-title"
					>
						{subgraphTokenName[tokenData.address] ?? tokenData.name}
					</span>
					<span
						className={clsx('text text-bold margin-left-sm text-lg', {
							['text-sm']: isXs || isSm,
						})}
					>
						({subgraphTokenSymbol[tokenData.address] ?? tokenData.symbol})
					</span>
				</Row>
				<Row className="margin-top-sm margin-left-2xl flex-align-center">
					<span className="margin-right-md text text-bold text-lg">
						${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
					</span>
					<Percent value={tokenData.priceUSDChange} className="text text-bold" />
				</Row>
			</div>
			<div>
				<NextLinkFromReactRouter to={`/add/${address}`}>
					<NormalButton variant="default" classes={{ other: 'margin-right-sm' }}>
						<span className="text text-base text-bold">{t('Add Liquidity')}</span>
					</NormalButton>
				</NextLinkFromReactRouter>
				<NextLinkFromReactRouter to={`/swap?outputCurrency=${address}`}>
					<NormalButton>
						<span className="text text-base text-bold">{t('Trade')}</span>
					</NormalButton>
				</NextLinkFromReactRouter>
			</div>
		</Row>
	)
}

export default TokenInfoHeader
