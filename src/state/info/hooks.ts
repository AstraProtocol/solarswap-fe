import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUnixTime, startOfHour, Duration, sub } from 'date-fns'
import useSWRImmutable from 'swr/immutable'
import { AppState, AppDispatch } from 'state'
import { isAddress } from 'utils'
import { Transaction } from 'state/info/types'
import fetchPoolChartData from 'state/info/queries/pools/chartData'
import fetchPoolTransactions from 'state/info/queries/pools/transactions'
import fetchTokenChartData from 'state/info/queries/tokens/chartData'
import fetchTokenTransactions from 'state/info/queries/tokens/transactions'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import {
	updateProtocolData,
	updateProtocolChartData,
	updateProtocolTransactions,
	updatePoolData,
	addPoolKeys,
	updatePoolChartData,
	updatePoolTransactions,
	updateTokenData,
	addTokenKeys,
	addTokenPoolAddresses,
	updateTokenChartData,
	updateTokenPriceData,
	updateTokenTransactions,
} from './actions'
import { ProtocolData, PoolData, TokenData, ChartEntry, PriceChartEntry } from './types'
import { fetchAllTokenData, fetchAllTokenDataByAddresses } from './queries/tokens/tokenData'
import { Block } from './queries/types'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlockFromTimeStampSWR } from 'views/Info/hooks/useBlocksFromTimestamps'
import { checkIsStableSwap } from './constant'
import { SWRConfiguration } from 'swr'
import { fetchAllPoolData, fetchAllPoolDataWithAddress } from './queries/pools/poolData'
import { fetchGlobalChartData } from './queries/protocol/chart'
import { fetchProtocolData } from './queries/protocol/overview'
import fetchTopTransactions from './queries/protocol/transactions'
import BigNumber from 'bignumber.js'
import { getAprsForStableFarm } from 'utils/getAprsForStableFarm'

// Protocol hooks

const refreshIntervalForInfo = 15000 // 15s
const SWR_SETTINGS_WITHOUT_REFETCH = {
	errorRetryCount: 3,
	errorRetryInterval: 3000,
}
const SWR_SETTINGS: SWRConfiguration = {
	refreshInterval: refreshIntervalForInfo,
	// keepPreviousData: true,
	...SWR_SETTINGS_WITHOUT_REFETCH,
}

export const useProtocolData = (): [ProtocolData | undefined, (protocolData: ProtocolData) => void] => {
	const protocolData: ProtocolData | undefined = useSelector((state: AppState) => state.info.protocol.overview)

	const dispatch = useDispatch<AppDispatch>()
	const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
		(data: ProtocolData) => dispatch(updateProtocolData({ protocolData: data })),
		[dispatch],
	)

	return [protocolData, setProtocolData]
}

export const useProtocolChartData = (): [ChartEntry[] | undefined, (chartData: ChartEntry[]) => void] => {
	const chartData: ChartEntry[] | undefined = useSelector((state: AppState) => state.info.protocol.chartData)
	const dispatch = useDispatch<AppDispatch>()
	const setChartData: (chartData: ChartEntry[]) => void = useCallback(
		(data: ChartEntry[]) => dispatch(updateProtocolChartData({ chartData: data })),
		[dispatch],
	)
	return [chartData, setChartData]
}

export const useProtocolTransactions = (): [Transaction[] | undefined, (transactions: Transaction[]) => void] => {
	const transactions: Transaction[] | undefined = useSelector((state: AppState) => state.info.protocol.transactions)
	const dispatch = useDispatch<AppDispatch>()
	const setTransactions: (transactions: Transaction[]) => void = useCallback(
		(transactionsData: Transaction[]) => dispatch(updateProtocolTransactions({ transactions: transactionsData })),
		[dispatch],
	)
	return [transactions, setTransactions]
}

// Pools hooks

export const useAllPoolData = (): {
	[address: string]: { data?: PoolData }
} => {
	return useSelector((state: AppState) => state.info.pools.byAddress)
}

export const useUpdatePoolData = (): ((pools: PoolData[]) => void) => {
	const dispatch = useDispatch<AppDispatch>()
	return useCallback((pools: PoolData[]) => dispatch(updatePoolData({ pools })), [dispatch])
}

export const useAddPoolKeys = (): ((addresses: string[]) => void) => {
	const dispatch = useDispatch<AppDispatch>()
	return useCallback((poolAddresses: string[]) => dispatch(addPoolKeys({ poolAddresses })), [dispatch])
}

export const usePoolDatas = (poolAddresses: string[]): PoolData[] => {
	const allPoolData = useAllPoolData()
	const addNewPoolKeys = useAddPoolKeys()

	const untrackedAddresses = poolAddresses.reduce((accum: string[], address) => {
		if (!Object.keys(allPoolData).includes(address)) {
			accum.push(address)
		}
		return accum
	}, [])

	useEffect(() => {
		if (untrackedAddresses) {
			addNewPoolKeys(untrackedAddresses)
		}
	}, [addNewPoolKeys, untrackedAddresses])

	const poolsWithData = poolAddresses
		.map(address => {
			return allPoolData[address]?.data
		})
		.filter(pool => pool)

	return poolsWithData
}

export const usePoolChartData = (address: string): ChartEntry[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const pool = useSelector((state: AppState) => state.info.pools.byAddress[address])
	const chartData = pool?.chartData
	const [error, setError] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const { error: fetchError, data } = await fetchPoolChartData(address)
			if (!fetchError && data) {
				dispatch(updatePoolChartData({ poolAddress: address, chartData: data }))
			}
			if (fetchError) {
				setError(fetchError)
			}
		}
		if (!chartData && !error) {
			fetch()
		}
	}, [address, dispatch, error, chartData])

	return chartData
}

export const usePoolTransactions = (address: string): Transaction[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const pool = useSelector((state: AppState) => state.info.pools.byAddress[address])
	const transactions = pool?.transactions
	const [error, setError] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const { error: fetchError, data } = await fetchPoolTransactions(address)
			if (fetchError) {
				setError(true)
			} else {
				dispatch(updatePoolTransactions({ poolAddress: address, transactions: data }))
			}
		}
		if (!transactions && !error) {
			fetch()
		}
	}, [address, dispatch, error, transactions])

	return transactions
}

// Tokens hooks

export const useAllTokenData = (): {
	[address: string]: { data?: TokenData }
} => {
	return useSelector((state: AppState) => state.info.tokens.byAddress)
}

export const useUpdateTokenData = (): ((tokens: TokenData[]) => void) => {
	const dispatch = useDispatch<AppDispatch>()
	return useCallback(
		(tokens: TokenData[]) => {
			dispatch(updateTokenData({ tokens }))
		},
		[dispatch],
	)
}

export const useAddTokenKeys = (): ((addresses: string[]) => void) => {
	const dispatch = useDispatch<AppDispatch>()
	return useCallback((tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses })), [dispatch])
}

export const useTokenDatas = (addresses?: string[]): TokenData[] | undefined => {
	const allTokenData = useAllTokenData()
	const addNewTokenKeys = useAddTokenKeys()

	// if token not tracked yet track it
	addresses?.forEach(a => {
		if (!allTokenData[a]) {
			addNewTokenKeys([a])
		}
	})

	const tokensWithData = useMemo(() => {
		if (!addresses) {
			return undefined
		}
		return addresses
			.map(a => {
				return allTokenData[a]?.data
			})
			.filter(token => token)
	}, [addresses, allTokenData])

	return tokensWithData
}

export const useTokenData = (address: string | undefined): TokenData | undefined => {
	const allTokenData = useAllTokenData()
	const addNewTokenKeys = useAddTokenKeys()

	if (!address || !isAddress(address)) {
		return undefined
	}

	// if token not tracked yet track it
	if (!allTokenData[address]) {
		addNewTokenKeys([address])
	}

	return allTokenData[address]?.data
}

export const usePoolsForToken = (address: string): string[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
	const poolsForToken = token.poolAddresses
	const [error, setError] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const { error: fetchError, addresses } = await fetchPoolsForToken(address)
			if (!fetchError && addresses) {
				dispatch(addTokenPoolAddresses({ tokenAddress: address, poolAddresses: addresses }))
			}
			if (fetchError) {
				setError(fetchError)
			}
		}
		if (!poolsForToken && !error) {
			fetch()
		}
	}, [address, dispatch, error, poolsForToken])

	return poolsForToken
}

export const useTokenChartData = (address: string): ChartEntry[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
	const { chartData } = token
	const [error, setError] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const { error: fetchError, data } = await fetchTokenChartData(address)
			if (!fetchError && data) {
				dispatch(updateTokenChartData({ tokenAddress: address, chartData: data }))
			}
			if (fetchError) {
				setError(fetchError)
			}
		}
		if (!chartData && !error) {
			fetch()
		}
	}, [address, dispatch, error, chartData])

	return chartData
}

export const useTokenPriceData = (
	address: string,
	interval: number,
	timeWindow: Duration,
): PriceChartEntry[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
	const priceData = token?.priceData[interval]
	const [error, setError] = useState(false)

	// construct timestamps and check if we need to fetch more data
	const oldestTimestampFetched = token?.priceData.oldestFetchedTimestamp
	const utcCurrentTime = getUnixTime(new Date()) * 1000
	const startTimestamp = getUnixTime(startOfHour(sub(utcCurrentTime, timeWindow)))

	useEffect(() => {
		const fetch = async () => {
			const { data, error: fetchingError } = await fetchTokenPriceData(address, interval, startTimestamp)
			if (data) {
				dispatch(
					updateTokenPriceData({
						tokenAddress: address,
						secondsInterval: interval,
						priceData: data,
						oldestFetchedTimestamp: startTimestamp,
					}),
				)
			}
			if (fetchingError) {
				setError(true)
			}
		}
		if (!priceData && !error) {
			fetch()
		}
	}, [address, dispatch, error, interval, oldestTimestampFetched, priceData, startTimestamp, timeWindow])

	return priceData
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
	const { transactions } = token
	const [error, setError] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const { error: fetchError, data } = await fetchTokenTransactions(address)
			if (fetchError) {
				setError(true)
			} else if (data) {
				dispatch(updateTokenTransactions({ tokenAddress: address, transactions: data }))
			}
		}
		if (!transactions && !error) {
			fetch()
		}
	}, [address, dispatch, error, transactions])

	return transactions
}

export const useTokenDataSWR = (address: string | undefined): TokenData | undefined => {
	const allTokenData = useTokenDatasSWR([address])
	return allTokenData?.find(d => d.address === address) ?? undefined
}

export const useTokenDatasSWR = (addresses?: string[], withSettings = true): TokenData[] | undefined => {
	const name = addresses?.join('')
	const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
	const { blocks } = useBlockFromTimeStampSWR([t24h, t48h, t7d, t14d])
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data, isValidating } = useSWRImmutable(
		blocks && [`info/token/data/${name}/${type}`],
		() => fetcher(addresses || [], blocks),
		withSettings ? SWR_SETTINGS : SWR_SETTINGS_WITHOUT_REFETCH,
	)
	const allData = useMemo(() => {
		return data && data.length > 0
			? data.reduce((a, b) => {
					return { ...a, ...b }
			  }, {})
			: {}
	}, [data])

	const tokensWithData = useMemo(() => {
		if (!addresses && allData) {
			return undefined
		}
		return addresses?.map(a => allData?.[a]?.data)?.filter(d => d && d.exists)
	}, [addresses, allData])

	return useMemo(() => {
		return isValidating ? [] : tokensWithData ?? undefined
	}, [isValidating, tokensWithData])
}

const graphPerPage = 50
const fetcher = (addresses: string[], blocks: Block[]) => {
	const times = Math.ceil(addresses.length / graphPerPage)
	const addressGroup = []
	for (let i = 0; i < times; i++) {
		addressGroup.push(addresses.slice(i * graphPerPage, (i + 1) * graphPerPage))
	}
	return Promise.all(addressGroup.map(d => fetchAllTokenDataByAddresses(blocks, d)))
}
export const useAllTokenDataSWR = (): {
	[address: string]: { data?: TokenData }
} => {
	const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
	const { blocks } = useBlockFromTimeStampSWR([t24h, t48h, t7d, t14d])
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		blocks && [`info/token/data/${type}`],
		() => fetchAllTokenData(blocks),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)
	return data ?? {}
}

export const useStableSwapPath = () => {
	return checkIsStableSwap() ? '?type=stableSwap' : ''
}

export const usePoolsForTokenSWR = (address: string): string[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		[`info/token/poolAddress/${address}/${type}`],
		() => fetchPoolsForToken(address),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)

	return data?.addresses ?? undefined
}

export const usePoolDatasSWR = (poolAddresses: string[]): PoolData[] => {
	const name = poolAddresses.join('')
	const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
	const { blocks } = useBlockFromTimeStampSWR([t24h, t48h, t7d, t14d])
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		blocks && [`info/pool/data/${name}/${type}`],
		() => fetchAllPoolDataWithAddress(blocks, poolAddresses),
		SWR_SETTINGS,
	)

	return useMemo(() => {
		return poolAddresses
			.map(address => {
				return data?.[address]?.data
			})
			.filter(pool => pool)
	}, [data, poolAddresses])
}

export const useTokenTransactionsSWR = (address: string): Transaction[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		[`info/token/transactionsData/${address}/${type}`],
		() => fetchTokenTransactions(address),
		SWR_SETTINGS,
	)
	return data?.data ?? undefined
}

export const useTokenChartDataSWR = (address: string): ChartEntry[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		address && [`info/token/chartData/${address}/${type}`],
		() => fetchTokenChartData(address),
		SWR_SETTINGS,
	)

	return data?.data ?? undefined
}

export const useTokenPriceDataSWR = (
	address: string,
	interval: number,
	timeWindow: Duration,
): PriceChartEntry[] | undefined => {
	const utcCurrentTime = getUnixTime(new Date()) * 1000
	const startTimestamp = getUnixTime(startOfHour(sub(utcCurrentTime, timeWindow)))

	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		[`info/token/priceData/${address}/${type}`],
		() => fetchTokenPriceData(address, interval, startTimestamp),
		SWR_SETTINGS,
	)
	return data?.data ?? undefined
}

export const usePoolTransactionsSWR = (address: string): Transaction[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		[`info/pool/transactionsData/${address}/${type}`],
		() => fetchPoolTransactions(address),
		SWR_SETTINGS,
	)
	return data?.data ?? undefined
}

export const usePoolChartDataSWR = (address: string): ChartEntry[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		[`info/pool/chartData/${address}/${type}`],
		() => fetchPoolChartData(address),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)
	return data?.data ?? undefined
}

export const useProtocolChartDataSWR = (): ChartEntry[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data: chartData } = useSWRImmutable(
		[`info/protocol/updateProtocolChartData/${type}`],
		() => fetchGlobalChartData(),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)
	return chartData ?? undefined
}

export const useProtocolDataSWR = (): ProtocolData | undefined => {
	const [t24, t48] = getDeltaTimestamps()
	const { blocks } = useBlockFromTimeStampSWR([t24, t48])
	const [block24, block48] = blocks ?? []
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data: protocolData } = useSWRImmutable(
		block24 && block48 ? [`info/protocol/updateProtocolData/${type}`] : null,
		() => fetchProtocolData(block24, block48),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)

	return protocolData ?? undefined
}

export const useProtocolTransactionsSWR = (): Transaction[] | undefined => {
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data: transactions } = useSWRImmutable(
		[`info/protocol/updateProtocolTransactionsData/${type}`],
		() => fetchTopTransactions(),
		SWR_SETTINGS, // update latest Transactions per 15s
	)
	return transactions ?? undefined
}

export const useAllPoolDataSWR = () => {
	const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
	const { blocks } = useBlockFromTimeStampSWR([t24h, t48h, t7d, t14d])
	const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
	const { data } = useSWRImmutable(
		blocks && [`info/pools/data/${type}`],
		() => fetchAllPoolData(blocks),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)
	return useMemo(() => {
		return data ?? {}
	}, [data])
}

const stableSwapAPRWithAddressesFetcher = async (addresses: string[]) => {
	return Promise.all(addresses.map(d => getAprsForStableFarm(d)))
}

export const useStableSwapTopPoolsAPR = (addresses: string[]): Record<string, number> => {
	const isStableSwap = checkIsStableSwap()
	const { data } = useSWRImmutable<BigNumber[]>(
		isStableSwap && addresses?.length > 0 && [`info/pool/stableAPRs/Addresses/`],
		() => stableSwapAPRWithAddressesFetcher(addresses),
		SWR_SETTINGS_WITHOUT_REFETCH,
	)
	const addressWithAPR = useMemo(() => {
		const result: Record<string, number> = {}
		data?.forEach((d, index) => {
			result[addresses[index]] = d?.toNumber()
		})
		return result
	}, [addresses, data])
	return useMemo(() => {
		return isStableSwap ? addressWithAPR : {}
	}, [isStableSwap, addressWithAPR])
}