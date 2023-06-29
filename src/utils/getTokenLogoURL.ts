const getTokenLogoURL = (address: string) => `${process.env.NEXT_PUBLIC_HOST}/images/tokens/${address}.svg`

export default getTokenLogoURL
