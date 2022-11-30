import clsx from 'clsx'
import { useTheme } from 'next-themes'
import Image from 'next/image'

import styles from '../style.module.scss'
import DarkIcon from './icon/dark.svg'
import LightIcon from './icon/light.svg'

export default function SwitchTheme() {
	const { resolvedTheme, setTheme } = useTheme()

	const _changeTheme = (theme: string) => {
		setTheme(theme)
	}

	return (
		<div className={clsx(styles.switchTheme, 'margin-right-xs margin-left-xs')}>
			<button
				onClick={() => _changeTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
				className="contrast-color-100"
			>
				<Image
					alt="switch-btn"
					src={resolvedTheme === 'light' ? LightIcon : DarkIcon}
					width={30}
					height={19}
					className="contrast-color-100"
				/>
			</button>
		</div>
	)
}
