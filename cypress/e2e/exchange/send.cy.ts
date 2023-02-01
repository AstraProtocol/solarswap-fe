describe('Send', () => {
	it('should redirect', () => {
		cy.visit('http://localhost/send')
		cy.url().should('include', '/swap')
	})

	it('should redirect with url params', () => {
		cy.visit(
			'http://localhost/send?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
		)
		cy.url().should(
			'contain',
			'http://localhost/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
		)
	})
})
