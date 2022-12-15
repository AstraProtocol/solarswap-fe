import { ContextApi } from 'contexts/Localization/types'
import { ElementType } from 'react'
// import { nftsBaseUrl } from 'views/Nft/market/constants'
// import { perpLangMap } from 'utils/getPerpetualLanguageCode'

export type MenuItemsType = {
	label: string
	href: string
	icon?: ElementType<any>
	fillIcon?: ElementType<any>
	// items?: DropdownMenuItems[];
	item?: any[]
	showOnMobile?: boolean
	showItemsOnMobile?: boolean
}

// export interface DropdownMenuItems {
//   label?: string | React.ReactNode;
//   href?: string;
//   onClick?: () => void;
//   type?: DropdownMenuItemType;
//   status?: LinkStatus;
//   disabled?: boolean;
//   iconName?: string;
//   isMobileOnly?: boolean;
// }

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t'], languageCode?: string) => any[] = t => [
	{
		label: t('Trade'),
		// icon: SwapIcon,
		// fillIcon: SwapFillIcon,
		href: '/swap',
		showItemsOnMobile: true,
		items: [
			{
				label: t('Swap'),
				href: '/swap'
			},
			// {
			//   label: t('Limit'),
			//   href: '/limit-orders',
			// },
			{
				label: t('Liquidity'),
				href: '/liquidity'
			}
			// {
			//   label: t('Perpetual'),
			//   href: `https://perp.solarswap.io/${perpLangMap(languageCode)}/futures/BTCUSDT`,
			//   type: DropdownMenuItemType.EXTERNAL_LINK,
			// },
		]
	},
	{
		label: t('Farms'),
		href: '/farms',
		// icon: EarnIcon,
		// fillIcon: EarnFillIcon,
		showItemsOnMobile: false,
		items: [
			// {
			//   label: t('Farms'),
			//   href: '/farms',
			// },
			// {
			//   label: t('Pools'),
			//   href: '/pools',
			// },
		]
	}
]

export default config
