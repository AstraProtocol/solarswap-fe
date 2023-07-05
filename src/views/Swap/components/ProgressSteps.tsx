import { Row } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import { AutoColumn } from 'components/Layout/Column'
import styles from './styles.module.scss'

interface ProgressCirclesProps {
	steps: boolean[]
	disabled?: boolean
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
export default function ProgressCircles({ steps, disabled = false, ...rest }: ProgressCirclesProps) {
	return (
		<AutoColumn justify="center" {...rest}>
			<Row style={{ justifyContent: 'space-between', width: '50%' }}>
				{steps.map((step, i) => {
					return (
						<div className={styles.circleRow} key={i}>
							<div
								className={clsx(
									styles.circle,
									'text-base',
									disabled || (!steps[i - 1] && i !== 0)
										? 'contrast-bg-color-10'
										: 'secondary-bg-color-normal',
								)}
							>
								{step ? '✓' : i + 1}
							</div>
							<div
								className={clsx(
									styles.connector,
									disabled || !steps[steps.length - 1]
										? 'contrast-bg-color-10'
										: 'secondary-bg-color-normal',
								)}
							/>
						</div>
					)
				})}
				<div
					className={clsx(
						styles.circle,
						'text-base',
						disabled || !steps[steps.length - 1] ? 'contrast-bg-color-10' : 'secondary-bg-color-normal',
					)}
				>
					{steps.length + 1}
				</div>
			</Row>
		</AutoColumn>
	)
}
