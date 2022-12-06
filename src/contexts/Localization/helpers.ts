/**
 * @fileoverview Tien 05/12/2022
 */
import { VI } from 'config/localization/languages'

const publicUrl = process.env.PUBLIC_URL || ''

export const LS_KEY = 'solarswap_language'

export const fetchLocale = async locale => {
	const response = await fetch(`${publicUrl}/locales/${locale}.json`)
	if (response.ok) {
		const data = await response.json()
		return data
	}

	console.error(`API: Failed to fetch locale ${locale}`, response.statusText)
	return null
}

export const getLanguageCodeFromLS = () => {
	try {
		const codeFromStorage = localStorage.getItem(LS_KEY)

		return codeFromStorage || VI.locale
	} catch {
		return VI.locale
	}
}
