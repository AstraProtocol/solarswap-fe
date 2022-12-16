import { Toggle } from '@astraprotocol/astra-ui'
import { useTheme } from 'next-themes'
// import { memo } from 'react'
// import { SunIcon, MoonIcon } from "../Svg";
// import { Toggle } from "../Toggle";

const ThemeSwitcher = () => {
	const { resolvedTheme, setTheme } = useTheme()
	const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
	return (
		<Toggle
			checked={resolvedTheme === 'dark'}
			defaultColor="textDisabled"
			checkedColor="textDisabled"
			onChange={() => setTheme(nextTheme)}
			scale="md"
			// startIcon={(isActive = false) => <SunIcon color={isActive ? "warning" : "backgroundAlt"} />}
			// endIcon={(isActive = false) => <MoonIcon color={isActive ? "secondary" : "backgroundAlt"} />}
		/>
	)
}

export default ThemeSwitcher
