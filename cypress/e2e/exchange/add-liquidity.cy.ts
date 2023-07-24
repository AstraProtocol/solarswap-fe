import { ChainId } from '@solarswap/sdk'

describe('Add Liquidity', () => {
	const HOST = 'http://localhost:3000'
	const WASA = Cypress.env('WASA')
    const USDT = Cypress.env('USDT')
    const TNT = Cypress.env('TNT')
    const TNT2 = Cypress.env('TNT2')

	/** Normal Add Liquidity */

	it('loads the two correct tokens', () => {
		cy.visit(`${HOST}/add/${USDT}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('loads the ASA and tokens', () => {
		cy.visit(`${HOST}/add/ASA/${USDT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'USDT')
	})

	it('loads the WASA and tokens', () => {
		cy.visit(`${HOST}/add/${WASA}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/add/ASA/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'ASA')
	})

	it('does not crash if address is duplicated', () => {
		cy.visit(`${HOST}/add/${TNT}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'TNT')
	})

	it('token not in storage is loaded', () => {
		cy.visit(`${HOST}/add/${TNT2}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('single token can be selected', () => {
		cy.visit(`${HOST}/add/${TNT2}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.visit(`${HOST}/add/${USDT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.visit(`${HOST}/add/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
	})

	it('redirects /add/token-token to add/token/token', () => {
		cy.visit(`${HOST}/add/${TNT}-${USDT}`)
		cy.url().should('contain', `/add/${TNT}/${USDT}`)
	})

	it('redirects /add/ASA-token to /add/ASA/token', () => {
		cy.visit(`${HOST}/add/ASA-${USDT}`)
		cy.url().should('contain', `/add/ASA/${USDT}`)
	})

	it('redirects /add/token-ASA to /add/token/ASA', () => {
		cy.visit(`${HOST}/add/${USDT}-ASA`)
		cy.url().should('contain', `/add/${USDT}/ASA`)
	})

	it('redirects /add/WASA-token to /add/WASA/token', () => {
		cy.visit(`${HOST}/add/${WASA}-${TNT}`)
		cy.url().should('contain', `/add/${WASA}/${TNT}`)
	})

	it('redirects /add/token-WASA to /add/token/WASA', () => {
		cy.visit(`${HOST}/add/${TNT}-${WASA}`)
		cy.url().should('contain', `/add/${TNT}/${WASA}`)
	})

	/** Single-sided Add Liquidity */

	it('Single-sided - loads the two correct tokens', () => {
		cy.visit(`${HOST}/add-single/${USDT}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - loads the ASA and tokens', () => {
		cy.visit(`${HOST}/add-single/ASA/${USDT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'USDT')
	})

	it('Single-sided - loads the WASA and tokens', () => {
		cy.visit(`${HOST}/add-single/${WASA}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/add-single/ASA/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'ASA')
	})

	it('Single-sided - does not crash if address is duplicated', () => {
		cy.visit(`${HOST}/add-single/${TNT}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'TNT')
	})

	it('Single-sided - token not in storage is loaded', () => {
		cy.visit(`${HOST}/add-single/${TNT2}/${TNT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - single token can be selected', () => {
		cy.visit(`${HOST}/add-single/${TNT2}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.visit(`${HOST}/add-single/${USDT}`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.visit(`${HOST}/add-single/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
	})

	it('Single-sided - redirects /add-single/token-token to add-single/token/token', () => {
		cy.visit(`${HOST}/add-single/${TNT}-${USDT}`)
		cy.url().should('contain', `/add/${TNT}/${USDT}`)
	})

	it('Single-sided - redirects /add-single/ASA-token to /add-single/ASA/token', () => {
		cy.visit(`${HOST}/add-single/ASA-${USDT}`)
		cy.url().should('contain', `/add-single/ASA/${USDT}`)
	})

	it('Single-sided - redirects /add-single/token-ASA to /add-single/token/ASA', () => {
		cy.visit(`${HOST}/add-single/${USDT}-ASA`)
		cy.url().should('contain', `/add-single/${USDT}/ASA`)
	})

	it('Single-sided - redirects /add-single/WASA-token to /add-single/WASA/token', () => {
		cy.visit(`${HOST}/add-single/${WASA}-${TNT}`)
		cy.url().should('contain', `/add/${WASA}/${TNT}`)
	})

	it('Single-sided - redirects /add-single/token-WASA to /add-single/token/WASA', () => {
		cy.visit(`${HOST}/add-single/${TNT}-${WASA}`)
		cy.url().should('contain', `/add/${TNT}/${WASA}`)
	})
})
