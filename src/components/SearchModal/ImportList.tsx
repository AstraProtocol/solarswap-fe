import { useState, useCallback } from 'react'
import { AutoColumn } from 'components/Layout/Column'
import { Checkbox, Message, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'
import { ListLogo } from 'components/Logo'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'

interface ImportProps {
	listURL: string
	list: TokenList
	onImport: () => void
}

function ImportList({ listURL, list, onImport }: ImportProps) {
	const dispatch = useDispatch<AppDispatch>()

	const { t } = useTranslation()

	// user must accept
	const [confirmed, setConfirmed] = useState(false)

	const lists = useAllLists()
	const fetchList = useFetchListCallback()

	// monitor is list is loading
	const adding = Boolean(lists[listURL]?.loadingRequestId)
	const [addError, setAddError] = useState<string | null>(null)

	const handleAddList = useCallback(() => {
		if (adding) return
		setAddError(null)
		fetchList(listURL)
			.then(() => {
				dispatch(enableList(listURL))
				onImport()
			})
			.catch(error => {
				setAddError(error.message)
				dispatch(removeList(listURL))
			})
	}, [adding, dispatch, fetchList, listURL, onImport])

	return (
		<div className="width-100">
			<div className="flex col">
				<div className="flex col">
					<div className="padding-top-sm padding-bottom-sm padding-left-lg padding-right-lg">
						{/** Card */}
						<Row style={{ justifyContent: 'space-between' }}>
							<Row>
								{list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
								<div className="flex col" style={{ marginLeft: '20px' }}>
									<Row>
										<span className="text text-base text-bold">{list.name}</span>
										<div className={styles.textDot} />
										<span className="text text-sm">{list.tokens.length} tokens</span>
									</Row>
									<Typography.Link
										// small
										// external
										// ellipsis
										// maxWidth="90%"
										href={`https://tokenlists.org/token-list?url=${listURL}`}
									>
										{listURL}
									</Typography.Link>
								</div>
							</Row>
						</Row>
					</div>

					<Message variant="warning">
						<div className="flex col">
							<span className="text text-base text-center alert-color-error">
								{t('Import at your own risk')}
							</span>
							<span className="text text-base alert-color-error">
								{t(
									'By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.'
								)}
							</span>
							<span className="text text-base text-bold alert-color-error">
								{t('If you purchase a token from this list, you may not be able to sell it back.')}
							</span>
							<div className="flex flex-align-center">
								<Checkbox
									name="confirmed"
									type="checkbox"
									checked={confirmed}
									onChange={() => setConfirmed(!confirmed)}
									scale="sm"
								/>
								<span className="margin-left-xs" style={{ userSelect: 'none' }}>
									{t('I understand')}
								</span>
							</div>
						</div>
					</Message>

					<NormalButton disabled={!confirmed} onClick={handleAddList}>
						{t('Import')}
					</NormalButton>
					{addError ? (
						<span color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{addError}
						</span>
					) : null}
				</div>
			</div>
		</div>
	)
}

export default ImportList
