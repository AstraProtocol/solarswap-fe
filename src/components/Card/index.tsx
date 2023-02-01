import clsx from 'clsx'

interface CardProps {
	width?: string
	padding?: string
	border?: string
	borderRadius?: string
	className?: string
	children: JSX.Element | JSX.Element[] | string | string[]
}

const Card = ({ width, padding, border, borderRadius, children, className }: CardProps) => (
	<div
		style={{
			width: width ?? '100%',
			padding: padding ?? '1.25rem',
			border: border,
			borderRadius: borderRadius ?? '16px',
			backgroundColor: clsx('secondary-bg-color-lightest'),
		}}
	>
		{children}
	</div>
)

export default Card

export const LightCard = ({ children }) => (
	<Card className="border-solid border-base secondary-bg-color-lightest">{children}</Card>
)

export const LightGreyCard = ({ children }) => (
	<Card className="border-solid border-base border-color secondary-bg-color-lightest">{children}</Card>
)

export const GreyCard = ({ children }) => (
	<Card className="border-solid border-base secondary-bg-color-lightest">{children}</Card>
)
