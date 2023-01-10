// @todo will failed in some token not listed such as Astra
const getTokenLogoURL = (address: string) =>
	`${process.env.NEXT_PUBLIC_HOST}/images/tokens/${address}.png`

export default getTokenLogoURL
