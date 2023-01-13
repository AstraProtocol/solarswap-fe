import clsx from 'clsx'
import { useState, useEffect } from 'react'

import { CalculatorMode, RoiCalculatorReducerState } from './useRoiCalculatorReducer'
import styles from './styles.module.scss'
import { Icon, IconEnum } from '@astraprotocol/astra-ui'

interface AnimatedArrowProps {
	calculatorState: RoiCalculatorReducerState
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ calculatorState }) => {
	const [key, setKey] = useState('roiArrow-0')
	const { mode } = calculatorState.controls

	// Trigger animation on state change
	useEffect(() => {
		setKey(prevKey => {
			const prevId = parseInt(prevKey.split('-')[1], 10)
			return `roiArrow-${prevId + 1}`
		})
	}, [calculatorState])

	return (
		<div className={clsx(styles.arrowContainer, 'flex flex-justify-center margin-bottom-sm')} key={key}>
			{mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL ? (
				<Icon icon={IconEnum.ICON_DOWN} className="text-base" color="textSubtle" />
			) : (
				<Icon icon={IconEnum.ICON_UP} className="text-base" color="textSubtle" />
			)}
		</div>
	)
}

export default AnimatedArrow
