import { Icon, IconEnum } from '@astraprotocol/astra-ui'
// import ReactDOMServer from 'react-dom/server'
import styles from './styles.module.scss'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

type Place = 'top' | 'right' | 'bottom' | 'left'
interface Props {
	text: any
	id: string
	placement?: Place
	[key: string]: string
}

const QuestionHelper = ({ text = '', id, placement = 'top', ...props }: Props) => {
	useEffect(() => {
		ReactTooltip.rebuild()
	}, [text])

	return (
		<div {...props}>
			<Icon icon={IconEnum.ICON_HELP} data-tip={text} data-for={id} />
			<ReactTooltip id={id} arrowColor="#6535e9" className={styles.tooltip} effect="solid" place={placement} />
		</div>
	)
}

export default QuestionHelper
