import { useRouter } from 'next/router'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
	const router = useRouter()
	const isStableSwap = router.query.type === 'stableSwap'

	return (
		<>
			<InfoNav isStableSwap={isStableSwap} />
			{children}
		</>
	)
}
