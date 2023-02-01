import { useState } from 'react'
import { Token } from '@solarswap/sdk'
import { ButtonMenu, ButtonMenuItem } from '@astraprotocol/astra-ui'
import { TokenList } from '@uniswap/token-lists'
import { useTranslation } from 'contexts/Localization'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

// const StyledButtonMenu = styled(ButtonMenu)`
//   width: 100%;
// `

export default function Manage({
	setModalView,
	setImportList,
	setImportToken,
	setListUrl,
}: {
	setModalView: (view: CurrencyModalView) => void
	setImportToken: (token: Token) => void
	setImportList: (list: TokenList) => void
	setListUrl: (url: string) => void
}) {
	const [showLists, setShowLists] = useState(true)

	const { t } = useTranslation()

	return (
		<div className="flex col" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
			<ButtonMenu size={null} activeIndex={showLists ? 0 : 1} onItemClick={() => setShowLists(prev => !prev)}>
				<ButtonMenuItem width="50%">{t('Lists')}</ButtonMenuItem>
				<ButtonMenuItem width="50%">{t('Tokens')}</ButtonMenuItem>
			</ButtonMenu>
			{showLists ? (
				<ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
			) : (
				<ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
			)}
		</div>
	)
}
