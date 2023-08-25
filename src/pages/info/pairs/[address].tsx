import { useRouter } from 'next/router'
import { InfoPageLayout } from 'views/Info'
import Pool from 'views/Info/Pools/PoolPage'

const PoolPage = () => {
  const router = useRouter()
  return <Pool address={router.query.address ? String(router.query.address) : undefined} />
}

PoolPage.Layout = InfoPageLayout
PoolPage.chains = [] // set all

export default PoolPage
