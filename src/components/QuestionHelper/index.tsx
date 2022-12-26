import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import Tooltip from 'react-tooltip'
import ReactDOMServer from 'react-dom/server'
import styles from './styles.module.scss'
import { useEffect } from 'react'

type Place = 'top' | 'right' | 'bottom' | 'left'
interface Props {
	text: any
	id: string
	placement?: Place
	[key: string]: string
}

const QuestionHelper = ({ text, id, placement = 'top', ...props }: Props) => {
	useEffect(() => {
		Tooltip.rebuild()
	}, [])

	return (
		<div {...props} style={{ position: 'relative' }}>
			<Icon icon={IconEnum.ICON_HELP} data-tip={ReactDOMServer.renderToString(text)} data-for={id} />
			<Tooltip id={id} arrowColor="#6535e9" className={styles.tooltip} effect="solid" place={placement} />
		</div>
	)
}

export default QuestionHelper
