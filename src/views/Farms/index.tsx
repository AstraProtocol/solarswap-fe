import { FC } from 'react'
import Farms, { FarmsContext } from './Farms'

interface Props {
	children: JSX.Element | JSX.Element[] | string | string[]
}

export const FarmsPageLayout: FC<Props> = ({ children }: Props) => {
	return <Farms>{children}</Farms>
}

export { FarmsContext }
