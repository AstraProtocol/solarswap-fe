import Card from 'components/Card'
import Heading from 'components/Heading'
import Page from 'components/Layout/Page'
import { CHAIN_ID } from 'config/constants/networks'
import { useTranslation } from 'contexts/Localization'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { useMemo } from 'react'
import { useAllTokenDataSWR, useTokenDatasSWR } from 'state/info/hooks'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()

	const allTokens = useAllTokenDataSWR()

	const { savedTokens } = useInfoUserSavedTokensAndPools(parseInt(CHAIN_ID))

	const formattedTokens = useMemo(() => {
		return Object.values(allTokens)
			.map(token => token.data)
			.filter(token => token)
	}, [allTokens])
	const watchListTokens = useTokenDatasSWR(savedTokens)

	return (
		<Page>
			<Heading scale="lg" className="margin-bottom-md">
				{t('Your Watchlist')}
			</Heading>
			{watchListTokens.length > 0 ? (
				<TokenTable tokenDatas={watchListTokens} />
			) : (
				<Card>
					<span className="text text-base">{t('Saved tokens will appear here')}</span>
				</Card>
			)}
			<TopTokenMovers />
			<Heading scale="lg" className="margin-bottom-md margin-top-xl" id="info-tokens-title">
				{t('All Tokens')}
			</Heading>
			<TokenTable tokenDatas={formattedTokens} />
		</Page>
	)
}

export default TokensOverview
