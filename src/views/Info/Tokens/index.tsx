import Heading from 'components/Heading'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useMemo } from 'react'
import { useAllTokenDataSWR, useTokenDatasSWR } from 'state/info/hooks'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()

	const allTokens = useAllTokenDataSWR()

	const formattedTokens = useMemo(() => {
		return Object.values(allTokens)
			.map(token => token.data)
			.filter(token => token)
	}, [allTokens])

	return (
		<Page>
			<TopTokenMovers />
			<Heading scale="lg" className="margin-bottom-md margin-top-xl" id="info-tokens-title">
				{t('All Tokens')}
			</Heading>
			<TokenTable tokenDatas={formattedTokens} />
		</Page>
	)
}

export default TokensOverview
