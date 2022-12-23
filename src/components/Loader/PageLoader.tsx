import Page from '../Layout/Page'
import Spinner from './Spinner'

const PageLoader: React.FC = () => {
	return (
		<Page className="flex flex-justify-center flex-align-center">
			<Spinner />
		</Page>
	)
}

export default PageLoader
