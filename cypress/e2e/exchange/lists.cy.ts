import { ChainId } from '@solarswap/sdk'

describe('Lists', () => {
	const HOST = 'http://localhost:3000'
	const BUSD = Cypress.env('BUSD')
	beforeEach(() => {
		cy.visit(`${HOST}/swap`)
	})

	it('import token from url', () => {
		// Visit url
		cy.visit(`${HOST}/swap?inputCurrency=${BUSD}&outputCurrency=ASA`)

		// Modal confirm
		cy.get('#import-token-understand').click()
		cy.get('.token-dismiss-button').click()
		cy.get('#swap-currency-input #pair').should('contain', 'BUSD')
	})

	it('import token', () => {
		cy.get('#swap-currency-output .open-currency-select-button').click()
		cy.get('#token-search-input').type(BUSD)
		cy.get('.token-search-import-button').click()

		// Modal confirm
		cy.get('#import-token-understand').click()
		cy.get('.token-dismiss-button').click()
		cy.get('#swap-currency-output #pair').should('contain', 'BUSD')
	})

	it('change list', () => {
		cy.get('#swap-currency-output .open-currency-select-button').click()
		cy.get('.list-token-manage-button').click()
	})
})
