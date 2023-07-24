import { ChainId } from '@solarswap/sdk'

describe('Remove Liquidity', () => {
	const CHAIN_ID = Cypress.env('NEXT_PUBLIC_CHAIN_ID');
	const HOST = 'http://localhost:3000'
	const WASA =
		CHAIN_ID === ChainId.MAINNET.toString()
			? '0xEAd8b0094072CAAa333DD2Ca72E5856f808e83Cf'
			: '0xA625BF1c3565775B1859B579DF980Fef324E7315'
	const USDT =
		CHAIN_ID === ChainId.MAINNET.toString()
			? '0xa0161089652A33eeA83168dCd74287E58b390910'
			: '0x2039A56173fDac411975Bce6F756059Ac33d0d79'
	const TNT =
		CHAIN_ID === ChainId.MAINNET.toString()
			? '0x65136E09653713dCFDda550aD29E9b20E4a457C7'
			: '0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548'
	const TNT2 =
		CHAIN_ID === ChainId.MAINNET.toString()
			? '0x5e7311ce6E87D023751F073005555193b4Ef83F7'
			: '0xe65585B6Aa50f27d8C8aFac544c01d8668850f21'

	/** Normal Remove Liquidity */

	it('redirects from address-address to address/address', () => {
		cy.visit(`${HOST}/remove/${WASA}-${USDT}`)
		cy.url().should('contain', `/remove/${WASA}/${USDT}`)
	})

	it('asa-usdt remove', () => {
		cy.visit(`${HOST}/remove/ASA/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	it('usdt-asa remove', () => {
		cy.visit(`${HOST}/remove/${USDT}/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ASA')
	})

	it('loads the two correct tokens', () => {
		cy.visit(`${HOST}/remove/${USDT}/${TNT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'TNT')
	})

	it('does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/remove/ASA/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ASA')
	})

	it('does not crash if token is duplicated', () => {
		cy.visit(`${HOST}/remove/${USDT}/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	it('token not in storage is loaded', () => {
		cy.visit(`${HOST}/remove/${TNT2}/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'TNT2')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	/** Single-sided Remove Liquidity */

	it('Single-sided - redirects from address-address to address/address', () => {
		cy.visit(`${HOST}/remove-single/${WASA}-${USDT}`)
		cy.url().should('contain', `/remove/${WASA}/${USDT}`)
	})

	it('Single-sided - asa-usdt remove', () => {
		cy.visit(`${HOST}/remove-single/ASA/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
	})

	it('Single-sided - usdt-asa remove', () => {
		cy.visit(`${HOST}/remove-single/${USDT}/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - loads the two correct tokens', () => {
		cy.visit(`${HOST}/remove-single/${USDT}/${TNT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/remove-single/ASA/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
	})

	it('Single-sided - does not crash if token is duplicated', () => {
		cy.visit(`${HOST}/remove-single/${USDT}/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - token not in storage is loaded', () => {
		cy.visit(`${HOST}/remove-single/${TNT2}/${USDT}`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'TNT2')
	})
})
