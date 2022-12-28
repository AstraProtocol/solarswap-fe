import { Icon, IconEnum } from '@astraprotocol/astra-ui'

import styles from './styles.module.scss'

export function SwapCallbackError({ error }: { error: string }) {
	return (
		<div className={styles.swapCallbackErrorInner}>
			<div className={styles.swapCallbackErrorInnerAlertTriangle}>
				<Icon className="text-2xl contrast-color-70" icon={IconEnum.ICON_WARNING} />
			</div>
			<p className="text text-sm contrast-color-50">{error}</p>
		</div>
	)
}
