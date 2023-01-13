import { useEffect, useState, createElement } from 'react'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/farms/hooks'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema, FarmWithStakedValue } from '../types'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import styles from './styles.module.scss'

export interface RowProps {
	apr: AprProps
	farm: FarmProps
	earned: EarnedProps
	multiplier: MultiplierProps
	liquidity: LiquidityProps
	details: FarmWithStakedValue
}

interface RowPropsWithLoading extends RowProps {
	userDataReady: boolean
}

const cells = {
	apr: Apr,
	farm: Farm,
	earned: Earned,
	details: Details,
	multiplier: Multiplier,
	liquidity: Liquidity
}

const Row: React.FunctionComponent<RowPropsWithLoading> = props => {
	const { details, userDataReady } = props
	const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
	const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
	const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
	const { t } = useTranslation()

	const toggleActionPanel = () => {
		setActionPanelExpanded(!actionPanelExpanded)
	}

	useEffect(() => {
		setActionPanelExpanded(hasStakedAmount)
	}, [hasStakedAmount])

	const { isDesktop, isMobile } = useMatchBreakpoints()

	const isSmallerScreen = !isDesktop
	const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
	const columnNames = tableSchema.map(column => column.name)

	const handleRenderRow = () => {
		if (!isMobile) {
			return (
				<tr className="pointer border border-bottom-lg" onClick={toggleActionPanel}>
					{Object.keys(props).map(key => {
						const columnIndex = columnNames.indexOf(key)
						if (columnIndex === -1) {
							return null
						}

						switch (key) {
							case 'details':
								return (
									<td key={key}>
										<div className={styles.cellInner}>
											<CellLayout>
												<Details actionPanelToggled={actionPanelExpanded} />
											</CellLayout>
										</div>
									</td>
								)
							case 'apr':
								return (
									<td key={key}>
										<div className={styles.cellInner}>
											<CellLayout label={t('APR')}>
												<Apr {...props.apr} hideButton={isSmallerScreen} />
											</CellLayout>
										</div>
									</td>
								)
							default:
								return (
									<td key={key}>
										<div className={styles.cellInner}>
											<CellLayout label={t(tableSchema[columnIndex].label)}>
												{createElement(cells[key], { ...props[key], userDataReady })}
											</CellLayout>
										</div>
									</td>
								)
						}
					})}
				</tr>
			)
		}

		return (
			<tr className="pointer border border-bottom-lg" onClick={toggleActionPanel}>
				<td>
					<tr>
						<td className="padding-top-lg">
							<CellLayout>
								<Farm {...props.farm} />
							</CellLayout>
						</td>
					</tr>
					<tr className="flex flex-justify-center">
						<td className="padding-top-md padding-right-lg padding-bottom-md ">
							<CellLayout label={t('Earned')}>
								<Earned {...props.earned} userDataReady={userDataReady} />
							</CellLayout>
						</td>
						<td className="padding-top-md padding-bottom-lg ">
							<CellLayout label={t('APR')}>
								<Apr {...props.apr} hideButton />
							</CellLayout>
						</td>
					</tr>
				</td>
				<td>
					<div className={styles.cellInner}>
						<CellLayout>
							<Details actionPanelToggled={actionPanelExpanded} />
						</CellLayout>
					</div>
				</td>
			</tr>
		)
	}

	return (
		<>
			{handleRenderRow()}
			{shouldRenderChild && (
				<tr>
					<td colSpan={6}>
						<ActionPanel {...props} expanded={actionPanelExpanded} />
					</td>
				</tr>
			)}
		</>
	)
}

export default Row
