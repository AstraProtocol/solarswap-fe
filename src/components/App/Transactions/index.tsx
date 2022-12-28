import { IconButton, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import { useModal } from 'components/Modal'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
	const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
	return <IconButton icon={IconEnum.ICON_PLUS} onClick={onPresentTransactionsModal} />
}

export default Transactions
