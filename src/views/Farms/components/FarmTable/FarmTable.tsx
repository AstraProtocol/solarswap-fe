import { useRef } from 'react'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'

import Row, { RowProps } from './Row'
import { Icon, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import { useTable } from 'components/Table/useTable'
import { ColumnType } from 'components/Table/types'

export interface ITableProps {
	data: RowProps[]
	columns: ColumnType<RowProps>[]
	userDataReady: boolean
	sortColumn?: string
}

const FarmTable: React.FC<ITableProps> = props => {
	const tableWrapperEl = useRef<HTMLDivElement>(null)
	const { t } = useTranslation()
	const { data, columns, userDataReady } = props

	const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

	const scrollToTop = (): void => {
		tableWrapperEl.current.scrollIntoView({
			behavior: 'smooth',
		})
	}

	return (
		<div className="width-100 border border-base radius-lg margin-top-md margin-bottom-md" id="farms-table">
			<div className="position-relative">
				<div className={styles.tableWrapper} ref={tableWrapperEl}>
					<table className={styles.table}>
						<tbody className={styles.tbody}>
							{rows.map(row => {
								return (
									<Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
								)
							})}
						</tbody>
					</table>
				</div>
				<div className="flex flex-justify-center padding-top-xs padding-bottom-xs ">
					<NormalButton variant="text" onClick={scrollToTop} classes={{ other: 'width-100' }}>
						<span className="text text-base margin-right-xs">{t('To Top')}</span>
						<Icon icon={IconEnum.ICON_UP} classes="text text-base" />
					</NormalButton>
				</div>
			</div>
		</div>
	)
}

export default FarmTable
