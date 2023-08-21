import { Row, Typography } from '@astraprotocol/astra-ui'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useStableSwapPath } from 'state/info/hooks'
import { getAstraExplorerLink } from 'utils'
import truncateHash from 'utils/truncateHash'

const TokenInfoNav = ({ tokenData, address }) => {
	const infoTypeParam = useStableSwapPath()
	const { t } = useTranslation()
	return (
		<Row className="margin-bottom-lg margin-top-sm ">
			<Breadcrumbs className="margin-bottom-lg">
				<NextLinkFromReactRouter to={`/info${infoTypeParam}`}>
					<span className="text text-base">{t('Info')}</span>
				</NextLinkFromReactRouter>
				<NextLinkFromReactRouter to={`/info/tokens${infoTypeParam}`}>
					<span className="text text-base">{t('Tokens')}</span>
				</NextLinkFromReactRouter>
				<Row>
					<span className="text text-base margin-right-sm">{tokenData.symbol}</span>
					<span>{`(${truncateHash(address)})`}</span>
				</Row>
			</Breadcrumbs>
			<div>
				<Typography.Link target="_blank" href={getAstraExplorerLink(address, 'address')}>
					({t('View on AstraExplorer')})
				</Typography.Link>
			</div>
		</Row>
	)
}

export default TokenInfoNav
