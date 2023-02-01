import { memo, useCallback, useMemo, useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { TokenList, Version } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import { parseENSAddress } from 'utils/ENS/parseENSAddress'
import { useTranslation } from 'contexts/Localization'
import useFetchListCallback from '../../hooks/useFetchListCallback'

import { AppDispatch, AppState } from '../../state'
import { acceptListUpdate, removeList, disableList, enableList } from '../../state/lists/actions'
import { useIsListActive, useAllLists, useActiveListUrls } from '../../state/lists/hooks'
import uriToHttp from '../../utils/uriToHttp'

import { ListLogo } from '../Logo'
// import Row, { Row, RowBetween } from '../Layout/Row'
import { CurrencyModalView } from './types'
import { Form, NormalButton, Row, Toggle, Typography } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import { useTooltip } from 'hooks/useTooltip'

function listVersionLabel(version: Version): string {
	return `v${version.major}.${version.minor}.${version.patch}`
}

function listUrlRowHTMLId(listUrl: string) {
	return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
	const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
	const dispatch = useDispatch<AppDispatch>()
	const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

	const isActive = useIsListActive(listUrl)

	const { t } = useTranslation()

	const handleAcceptListUpdate = useCallback(() => {
		if (!pending) return
		dispatch(acceptListUpdate(listUrl))
	}, [dispatch, listUrl, pending])

	const handleRemoveList = useCallback(() => {
		// eslint-disable-next-line no-alert
		if (window.confirm('Please confirm you would like to remove this list')) {
			dispatch(removeList(listUrl))
		}
	}, [dispatch, listUrl])

	const handleEnableList = useCallback(() => {
		dispatch(enableList(listUrl))
	}, [dispatch, listUrl])

	const handleDisableList = useCallback(() => {
		dispatch(disableList(listUrl))
	}, [dispatch, listUrl])

	const { targetRef, tooltip, tooltipVisible } = useTooltip(
		<div>
			<span>{list && listVersionLabel(list.version)}</span>
			<Typography.Link href={`https://tokenlists.org/token-list?url=${listUrl}`}>{t('See')}</Typography.Link>
			<NormalButton onClick={handleRemoveList} disabled={Object.keys(listsByUrl).length === 1}>
				{t('Remove')}
			</NormalButton>
			{pending && (
				<NormalButton variant="text" onClick={handleAcceptListUpdate} style={{ fontSize: '12px' }}>
					{t('Update list')}
				</NormalButton>
			)}
		</div>,
		{ placement: 'right-end', trigger: 'click' },
	)

	if (!list) return null

	return (
		<div className={styles.rowWrapper} key={listUrl} id={listUrlRowHTMLId(listUrl)}>
			{tooltipVisible && tooltip}

			{list.logoURI ? (
				<ListLogo
					size="40px"
					style={{ marginRight: '1rem' }}
					logoURI={list.logoURI}
					alt={`${list.name} list logo`}
				/>
			) : (
				<div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
			)}
			<div className="flex flex-1">
				<Row>
					<span className="text text-bold">{list.name}</span>
				</Row>
				<Row style={{ marginTop: 4 }}>
					<span className="text text-sm text-lowercase">
						{list.tokens.length} {t('Tokens')}
					</span>
					<span ref={targetRef}>{/* <CogIcon color="text" width="12px" /> */}</span>
				</Row>
			</div>
			<Toggle
				checked={isActive}
				onChange={() => {
					if (isActive) {
						handleDisableList()
					} else {
						handleEnableList()
					}
				}}
			/>
		</div>
	)
})

function ManageLists({
	setModalView,
	setImportList,
	setListUrl,
}: {
	setModalView: (view: CurrencyModalView) => void
	setImportList: (list: TokenList) => void
	setListUrl: (url: string) => void
}) {
	const [listUrlInput, setListUrlInput] = useState<string>('')

	const { t } = useTranslation()

	const lists = useAllLists()

	// sort by active but only if not visible
	const activeListUrls = useActiveListUrls()
	const [activeCopy, setActiveCopy] = useState<string[] | undefined>()
	useEffect(() => {
		if (!activeCopy && activeListUrls) {
			setActiveCopy(activeListUrls)
		}
	}, [activeCopy, activeListUrls])

	const handleInput = useCallback(e => {
		setListUrlInput(e.target.value)
	}, [])

	const fetchList = useFetchListCallback()

	const validUrl: boolean = useMemo(() => {
		return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
	}, [listUrlInput])

	const sortedLists = useMemo(() => {
		const listUrls = Object.keys(lists)
		return listUrls
			.filter(listUrl => {
				// only show loaded lists, hide unsupported lists
				return Boolean(lists[listUrl].current) && !UNSUPPORTED_LIST_URLS.includes(listUrl)
			})
			.sort((u1, u2) => {
				const { current: l1 } = lists[u1]
				const { current: l2 } = lists[u2]

				// first filter on active lists
				if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
					return -1
				}
				if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
					return 1
				}

				if (l1 && l2) {
					// Always make Astra list in top.
					const keyword = 'astra'
					if (l1.name.toLowerCase().includes(keyword) || l2.name.toLowerCase().includes(keyword)) {
						return -1
					}

					return l1.name.toLowerCase() < l2.name.toLowerCase()
						? -1
						: l1.name.toLowerCase() === l2.name.toLowerCase()
						? 0
						: 1
				}
				if (l1) return -1
				if (l2) return 1
				return 0
			})
	}, [lists, activeCopy])

	// temporary fetched list for import flow
	const [tempList, setTempList] = useState<TokenList>()
	const [addError, setAddError] = useState<string | undefined>()

	useEffect(() => {
		async function fetchTempList() {
			fetchList(listUrlInput, false)
				.then(list => setTempList(list))
				.catch(() => setAddError('Error importing list'))
		}
		// if valid url, fetch details for card
		if (validUrl) {
			fetchTempList()
		} else {
			setTempList(undefined)
			if (listUrlInput !== '') {
				setAddError('Enter valid list location')
			}
		}

		// reset error
		if (listUrlInput === '') {
			setAddError(undefined)
		}
	}, [fetchList, listUrlInput, validUrl])

	// check if list is already imported
	const isImported = Object.keys(lists).includes(listUrlInput)

	// set list values and have parent modal switch to import list view
	const handleImport = useCallback(() => {
		if (!tempList) return
		setImportList(tempList)
		setModalView(CurrencyModalView.importList)
		setListUrl(listUrlInput)
	}, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

	return (
		// Wrapper
		<div>
			{/* <AutoColumn gap="14px"> */}
			<Form.Input
				id="list-add-input"
				classes={{ wapper: 'margin-top-md' }}
				// scale="lg"
				placeholder={t('https:// or ipfs:// or ENS name')}
				value={listUrlInput}
				onChange={handleInput}
			/>
			{addError ? (
				<span className="text alert-color-error" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
					{addError}
				</span>
			) : null}
			{/* </AutoColumn> */}
			{tempList && (
				<div className="flex col">
					<div className="flex col padding-top-sm padding-bottom-sm padding-left-lg padding-right-lg">
						{/** Card */}
						<Row style={{ justifyContent: 'space-between' }}>
							<Row>
								{tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
								<div className="flex col">
									<span className="text text-bold">{tempList.name}</span>
									<span className="text text-lowercase">
										{tempList.tokens.length} {t('Tokens')}
									</span>
								</div>
							</Row>
							{isImported ? (
								<Row>
									{/* <CheckmarkIcon width="16px" mr="10px" /> */}
									<span className="text">{t('Loaded')}</span>
								</Row>
							) : (
								<NormalButton onClick={handleImport}>{t('Import')}</NormalButton>
							)}
						</Row>
					</div>
				</div>
			)}
			<div>
				<div className="flex col">
					{sortedLists.map(listUrl => (
						<ListRow key={listUrl} listUrl={listUrl} />
					))}
				</div>
			</div>
		</div>
	)
}

export default ManageLists
