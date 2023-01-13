import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import { HtmlAttributes } from 'csstype'
import { Placement, useTooltip } from 'hooks/useTooltip'
import styles from './styles.module.scss'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	text: string | React.ReactNode
	placement?: Placement
	size?: string
}

const QuestionHelper: React.FC<Props> = ({ text, placement = 'right-end', size = '16px', ...props }) => {
	const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement, trigger: 'hover' })

	return (
		<div {...props}>
			{tooltipVisible && tooltip}
			<div className={styles.tooltip} ref={targetRef}>
				<Icon icon={IconEnum.ICON_HELP} />
			</div>
		</div>
	)
}

export default QuestionHelper
