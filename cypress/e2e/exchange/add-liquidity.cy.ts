describe('Add Liquidity', () => {
	const HOST = 'http://localhost:3000'

	/**
	 * Use contracts:
	 * WASA: 0xC60F8AF409Eac14d4926e641170382f313749Fdc
	 * USDT: 0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2
	 * TNT:  0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548
	 * TNT2: 0xe65585B6Aa50f27d8C8aFac544c01d8668850f21
	 */

	/** Normal Add Liquidity */

	it('loads the two correct tokens', () => {
		cy.visit(`${HOST}/add/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('loads the ASA and tokens', () => {
		cy.visit(`${HOST}/add/ASA/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'USDT')
	})

	it('loads the WASA and tokens', () => {
		cy.visit(`${HOST}/add/0xC60F8AF409Eac14d4926e641170382f313749Fdc/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/add/ASA/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'ASA')
	})

	it('does not crash if address is duplicated', () => {
		cy.visit(`${HOST}/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'TNT')
	})

	it('token not in storage is loaded', () => {
		cy.visit(`${HOST}/add/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('single token can be selected', () => {
		cy.visit(`${HOST}/add/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.visit(`${HOST}/add/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.visit(`${HOST}/add/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
	})

	it('redirects /add/token-token to add/token/token', () => {
		cy.visit(`${HOST}/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548-0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.url().should(
			'contain',
			'/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2',
		)
	})

	it('redirects /add/ASA-token to /add/ASA/token', () => {
		cy.visit(`${HOST}/add/ASA-0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.url().should('contain', '/add/ASA/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2')
	})

	it('redirects /add/token-ASA to /add/token/ASA', () => {
		cy.visit(`${HOST}/add/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2-ASA`)
		cy.url().should('contain', '/add/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2/ASA')
	})

	it('redirects /add/WASA-token to /add/WASA/token', () => {
		cy.visit(`${HOST}/add/0xC60F8AF409Eac14d4926e641170382f313749Fdc-0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`)
		cy.url().should(
			'contain',
			'/add/0xC60F8AF409Eac14d4926e641170382f313749Fdc/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548',
		)
	})

	it('redirects /add/token-WASA to /add/token/WASA', () => {
		cy.visit(`${HOST}/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548-0xC60F8AF409Eac14d4926e641170382f313749Fdc`)
		cy.url().should(
			'contain',
			'/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0xC60F8AF409Eac14d4926e641170382f313749Fdc',
		)
	})

	/** Single-sided Add Liquidity */

	it('Single-sided - loads the two correct tokens', () => {
		cy.visit(
			`${HOST}/add-single/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - loads the ASA and tokens', () => {
		cy.visit(`${HOST}/add-single/ASA/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'USDT')
	})

	it('Single-sided - loads the WASA and tokens', () => {
		cy.visit(
			`${HOST}/add-single/0xC60F8AF409Eac14d4926e641170382f313749Fdc/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - does not crash if ASA is duplicated', () => {
		cy.visit(`${HOST}/add-single/ASA/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'ASA')
	})

	it('Single-sided - does not crash if address is duplicated', () => {
		cy.visit(
			`${HOST}/add-single/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT')
		cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'TNT')
	})

	it('Single-sided - token not in storage is loaded', () => {
		cy.visit(
			`${HOST}/add-single/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'TNT')
	})

	it('Single-sided - single token can be selected', () => {
		cy.visit(`${HOST}/add-single/0xe65585B6Aa50f27d8C8aFac544c01d8668850f21`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'TNT2')
		cy.visit(`${HOST}/add-single/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'USDT')
		cy.visit(`${HOST}/add-single/ASA`)
		cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'ASA')
	})

	it('Single-sided - redirects /add-single/token-token to add-single/token/token', () => {
		cy.visit(
			`${HOST}/add-single/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548-0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`,
		)
		cy.url().should(
			'contain',
			'/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2',
		)
	})

	it('Single-sided - redirects /add-single/ASA-token to /add-single/ASA/token', () => {
		cy.visit(`${HOST}/add-single/ASA-0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2`)
		cy.url().should('contain', '/add-single/ASA/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2')
	})

	it('Single-sided - redirects /add-single/token-ASA to /add-single/token/ASA', () => {
		cy.visit(`${HOST}/add-single/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2-ASA`)
		cy.url().should('contain', '/add-single/0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2/ASA')
	})

	it('Single-sided - redirects /add-single/WASA-token to /add-single/WASA/token', () => {
		cy.visit(
			`${HOST}/add-single/0xC60F8AF409Eac14d4926e641170382f313749Fdc-0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548`,
		)
		cy.url().should(
			'contain',
			'/add/0xC60F8AF409Eac14d4926e641170382f313749Fdc/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548',
		)
	})

	it('Single-sided - redirects /add-single/token-WASA to /add-single/token/WASA', () => {
		cy.visit(
			`${HOST}/add-single/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548-0xC60F8AF409Eac14d4926e641170382f313749Fdc`,
		)
		cy.url().should(
			'contain',
			'/add/0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548/0xC60F8AF409Eac14d4926e641170382f313749Fdc',
		)
	})
})
