import { Row } from '@astraprotocol/astra-ui'
import { Children } from 'react'

const ModalActions: React.FC<any> = ({ children }) => {
	const l = Children.toArray(children).length
	return (
		<Row>
			{Children.map(children, (child, i) => (
				<>
					<div className="flex flex-1">{child}</div>
					{i < l - 1 && <div className="margin-left-sm" />}
				</>
			))}
		</Row>
	)
}

export default ModalActions
