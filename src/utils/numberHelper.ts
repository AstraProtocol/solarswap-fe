/**
 * @fileoverview Thinh 12/12/2022
 */
/**
 * Returns hex string
 * @param num
 */
export default function decimalToHex(num: number): string {
	const map = '0123456789abcdef'
	let hex = num === 0 ? '0' : ''
	while (num !== 0) {
		hex = map[num & 15] + hex
		num = num >>> 4
	}
	return '0x' + hex
}
