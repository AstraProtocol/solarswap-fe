describe('Pool', () => {
	const HOST = 'http://localHOST:3000'

	beforeEach(() => cy.visit(`${HOST}/liquidity`))
	it('add liquidity links to /add/', () => {
		cy.get('#join-pool-button').click()
		cy.url().should('contain', '/add')
	})

	it('add liquidity single links to /add-single/', () => {
		cy.get('#join-pool-single-button').click()
		cy.url().should('contain', '/add-single')
	})

	it('redirects /pool to /liquidity', () => {
		cy.visit(`${HOST}/pool`)
		cy.url().should('contain', '/liquidity')
	})

	it('import pool links to /find', () => {
		cy.get('#import-pool-link', { timeout: 20000 }).click()
		cy.url().should('contain', '/find')
	})
})
