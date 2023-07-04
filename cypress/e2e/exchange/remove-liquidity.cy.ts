describe('Remove Liquidity', () => {
	const HOST = 'http://localhost:3000'

	/**
	 * Use contracts:
	 * WASA: 0xA625BF1c3565775B1859B579DF980Fef324E7315
	 * USDT: 0x2039A56173fDac411975Bce6F756059Ac33d0d79
	 * TNT:  0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548
	 * TNT2: 0xe65585B6Aa50f27d8C8aFac544c01d8668850f21
	 */

	/** Normal Remove Liquidity */

	it('redirects from address-address to address/address', () => {
		cy.visit(`${HOST}/remove/0xA625BF1c3565775B1859B579DF980Fef324E7315-0x2039A56173fDac411975Bce6F756059Ac33d0d79`)
		cy.url().should(
			'contain',
			'/remove/0xA625BF1c3565775B1859B579DF980Fef324E7315/0x2039A56173fDac411975Bce6F756059Ac33d0d79',
		)
	})

	it('asa-usdt remove', () => {
		cy.visit(`${HOST}/remove/ASA/0x2039A56173fDac411975Bce6F756059Ac33d0d79`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	it('usdt-asa remove', () => {
		cy.visit(`${HOST}/remove/0x2039A56173fDac411975Bce6F756059Ac33d0d79/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ASA')
	})

	it('loads the two correct tokens', () => {
		cy.visit(`${HOST}/remove/0x2039A56173fDac411975Bce6F756059Ac33d0d79/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'TNT')
	})

	it('does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/remove/ASA/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ASA')
	})

	it('does not crash if token is duplicated', () => {
		cy.visit(`${HOST}/remove/0x2039A56173fDac411975Bce6F756059Ac33d0d79/0x2039A56173fDac411975Bce6F756059Ac33d0d79`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	it('token not in storage is loaded', () => {
		cy.visit(`${HOST}/remove/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21/0x2039A56173fDac411975Bce6F756059Ac33d0d79`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'TNT2')
		cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'USDT')
	})

	/** Single-sided Remove Liquidity */

	it('Single-sided - redirects from address-address to address/address', () => {
		cy.visit(
			`${HOST}/remove-single/0xA625BF1c3565775B1859B579DF980Fef324E7315-0x2039A56173fDac411975Bce6F756059Ac33d0d79`,
		)
		cy.url().should(
			'contain',
			'/remove/0xA625BF1c3565775B1859B579DF980Fef324E7315/0x2039A56173fDac411975Bce6F756059Ac33d0d79',
		)
	})

	it('Single-sided - asa-usdt remove', () => {
		cy.visit(`${HOST}/remove-single/ASA/0x2039A56173fDac411975Bce6F756059Ac33d0d79`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
	})

	it('Single-sided - usdt-asa remove', () => {
		cy.visit(`${HOST}/remove-single/0x2039A56173fDac411975Bce6F756059Ac33d0d79/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - loads the two correct tokens', () => {
		cy.visit(
			`${HOST}/remove-single/0x2039A56173fDac411975Bce6F756059Ac33d0d79/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/remove-single/ASA/ASA`)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'ASA')
	})

	it('Single-sided - does not crash if token is duplicated', () => {
		cy.visit(
			`${HOST}/remove-single/0x2039A56173fDac411975Bce6F756059Ac33d0d79/0x2039A56173fDac411975Bce6F756059Ac33d0d79`,
		)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'USDT')
	})

	it('Single-sided - token not in storage is loaded', () => {
		cy.visit(
			`${HOST}/remove-single/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21/0x2039A56173fDac411975Bce6F756059Ac33d0d79`,
		)
		cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'TNT2')
	})
})
