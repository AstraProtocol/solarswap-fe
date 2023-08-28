import { useTheme } from 'next-themes'
import { HTMLAttributes } from 'react'

// const HoverIcon = styled.div`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	:hover {
// 		cursor: pointer;
// 		opacity: 0.6;
// 	}
// `

const SaveIcon: React.FC<React.PropsWithChildren<{ fill: boolean } & HTMLAttributes<HTMLDivElement>>> = ({
	fill = false,
	...rest
}) => {
	const { theme } = useTheme()
	return null
	// return (
	// 	<HoverIcon {...rest}>
	// 		{fill ? (
	// 			<StarFillIcon stroke={theme.colors.warning} color={theme.colors.warning} />
	// 		) : (
	// 			<StarLineIcon stroke={theme.colors.textDisabled} />
	// 		)}
	// 	</HoverIcon>
	// )
}

export default SaveIcon
