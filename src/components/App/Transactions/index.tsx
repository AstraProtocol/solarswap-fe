import { IconButton, NormalButton } from '@astraprotocol/astra-ui'
import { useModal } from 'components/Modal'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
	const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
	return (
		// <>
			<IconButton icon="history" onClick={onPresentTransactionsModal} />
			{/* <HistoryIcon color="textSubtle" width="24px" /> */}
			{/* </NormalButton> */}
		// </>
	)
}

export default Transactions
