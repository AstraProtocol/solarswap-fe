import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { useState } from 'react'

type Place = 'top' | 'right' | 'bottom' | 'left'

interface Props {
	text: string
	id: string
	hasInsideModal?: boolean
	placement?: Place
	[key: string]: any
}

const QuestionHelper = ({ text = '', hasInsideModal = false, id, placement = 'top', ...props }: Props) => {
	const [offset, setOffset] = useState({ left: 0, top: 0 })

	// tooltip error inside modal: wrong position offset
	useEffect(() => {
		const element: any = document.querySelector(`[data-for='${id}']`)
		const tooltip: any = document.getElementById(id)

		if (element && tooltip) {
			setOffset({
				left: element.offsetLeft + tooltip.offsetWidth / 2,
				top: element.offsetTop - tooltip.offsetHeight / 2
			})
		}
	}, [id])

	return (
		<div {...props}>
			<Icon icon={IconEnum.ICON_HELP} data-tip={text} data-for={id} />
			{hasInsideModal ? (
				<ReactTooltip
					overridePosition={() => offset}
					id={id}
					arrowColor="transparent"
					className={styles.tooltip}
					effect="solid"
					place={placement}
				/>
			) : (
				<ReactTooltip
					id={id}
					arrowColor="#6535e9"
					className={styles.tooltip}
					effect="solid"
					place={placement}
				/>
			)}
		</div>
	)
}

export default QuestionHelper
