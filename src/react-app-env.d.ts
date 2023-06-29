interface Window {
	ethereum?: {
		isMetaMask?: true
		providers?: any[]
		request?: (...args: any[]) => Promise<void>
	}
	astra?: any
	BinanceChain?: {
		bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
	}
}

type SerializedBigNumber = string
