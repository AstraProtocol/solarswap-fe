import { ChainId } from '@solarswap/sdk'

describe('Remove Liquidity', () => {
	const HOST = 'http://localhost:3000'
	const WASA = Cypress.env('WASA')
    const USDT = Cypress.env('USDT')
    const TNT = Cypress.env('TNT')
    const TNT2 = Cypress.env('TNT2')

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
