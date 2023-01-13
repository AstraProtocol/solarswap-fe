// const Column = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: flex-start;
// `

import clsx from 'clsx'

// export const ColumnCenter = styled(Column)`
// width: 100%;
// align-items: center;
// `

// export const AutoColumn = styled.div<{
// 	gap?: 'sm' | 'md' | 'lg' | string
// 	justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
// }>`
// 	display: grid;
// 	grid-auto-rows: auto;
// 	grid-row-gap: ${({ gap }) =>
// 		(gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
// 	justify-items: ${({ justify }) => justify};
// `

interface AutoColumnProps {
	gap?: 'sm' | 'md' | 'lg' | string
	justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
	children: JSX.Element | JSX.Element[] | string | string[]
	style?: React.CSSProperties
}

const Column = ({ children, className }) => (
	<div className={clsx('flex flex-justify-center', className)}>{children}</div>
)
export const ColumnCenter = ({ children }) => <Column className="width-100 flex-align-center">{children}</Column>
export const AutoColumn = ({ children, gap, justify, style }: AutoColumnProps) => (
	<div
		style={{
			display: 'grid',
			gridAutoRows: 'auto',
			gridRowGap: (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap,
			justifyItems: justify,
			...style
		}}
	>
		{children}
	</div>
)

export default Column
