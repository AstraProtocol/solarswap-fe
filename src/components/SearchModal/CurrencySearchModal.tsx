import { useCallback, useState } from 'react'
import { Currency, Token } from '@solarswap/sdk'

import usePrevious from 'hooks/usePreviousValue'
import { TokenList } from '@uniswap/token-lists'
import { useTranslation } from 'contexts/Localization'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import ImportList from './ImportList'
import { CurrencyModalView } from './types'
import { NormalButton } from '@astraprotocol/astra-ui'
import { Modal } from 'components/Modal'
import styles from './styles.module.scss'

export type Handler = () => void
interface InjectedModalProps {
	onDismiss?: Handler
}

interface CurrencySearchModalProps extends InjectedModalProps {
	selectedCurrency?: Currency | null
	onCurrencySelect: (currency: Currency) => void
	otherSelectedCurrency?: Currency | null
	showCommonBases?: boolean
}

export default function CurrencySearchModal({
	onDismiss = () => null,
	onCurrencySelect,
	selectedCurrency,
	otherSelectedCurrency,
	showCommonBases = false,
}: CurrencySearchModalProps) {
	const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

	const handleCurrencySelect = useCallback(
		(currency: Currency) => {
			onDismiss?.()
			onCurrencySelect(currency)
		},
		[onDismiss, onCurrencySelect],
	)

	// for token import view
	const prevView = usePrevious(modalView)

	// used for import token flow
	const [importToken, setImportToken] = useState<Token | undefined>()

	// used for import list
	const [importList, setImportList] = useState<TokenList | undefined>()
	const [listURL, setListUrl] = useState<string | undefined>()

	const { t } = useTranslation()

	const config = {
		[CurrencyModalView.search]: { title: t('Select a Token'), onBack: undefined },
		[CurrencyModalView.manage]: { title: t('Manage'), onBack: () => setModalView(CurrencyModalView.search) },
		[CurrencyModalView.importToken]: {
			title: t('Import Tokens'),
			onBack: () =>
				setModalView(
					prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search,
				),
		},
		[CurrencyModalView.importList]: {
			title: t('Import List'),
			onBack: () => setModalView(CurrencyModalView.search),
		},
	}

	return (
		<Modal
			style={{ minWidth: '400px', maxWidth: 600 }}
			title={config[modalView].title}
			onBack={config[modalView].onBack}
			onDismiss={onDismiss}
		>
			<div className={styles.currencySearchModalBody}>
				{modalView === CurrencyModalView.search ? (
					<CurrencySearch
						onCurrencySelect={handleCurrencySelect}
						selectedCurrency={selectedCurrency}
						otherSelectedCurrency={otherSelectedCurrency}
						showCommonBases={showCommonBases}
						showImportView={() => setModalView(CurrencyModalView.importToken)}
						setImportToken={setImportToken}
					/>
				) : modalView === CurrencyModalView.importToken && importToken ? (
					<ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
				) : modalView === CurrencyModalView.importList && importList && listURL ? (
					<ImportList
						list={importList}
						listURL={listURL}
						onImport={() => setModalView(CurrencyModalView.manage)}
					/>
				) : modalView === CurrencyModalView.manage ? (
					<Manage
						setModalView={setModalView}
						setImportToken={setImportToken}
						setImportList={setImportList}
						setListUrl={setListUrl}
					/>
				) : (
					''
				)}
				{modalView === CurrencyModalView.search && (
					<div className="flex flex-justify-center">
						<NormalButton
							classes={{
								color: 'secondary-color-normal',
								other: 'text-bold text-base list-token-manage-button',
							}}
							variant="text"
							onClick={() => setModalView(CurrencyModalView.manage)}
						>
							{t('Manage Tokens')}
						</NormalButton>
					</div>
				)}
			</div>
		</Modal>
	)
}
