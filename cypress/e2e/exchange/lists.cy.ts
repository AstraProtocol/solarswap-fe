describe('Lists', () => {
	const HOST = 'http://localhost'
	const busd = '0x092d93f258ceea20c94ba01e8771115141dd7c20'
	beforeEach(() => {
		cy.visit(`${HOST}/swap`)
	})

	it('import token from url', () => {
		// Visit url
		cy.visit(`${HOST}/swap?inputCurrency=${busd}&outputCurrency=ASA`)

		// Modal confirm
		cy.get('#import-token-understand').click()
		cy.get('.token-dismiss-button').click()
		cy.get('#swap-currency-input #pair').should('contain', 'BUSD')
	})

	it('import token', () => {
		cy.get('#swap-currency-output .open-currency-select-button').click()
		cy.get('#token-search-input').type(busd)
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
