describe('Swap', () => {
	beforeEach(() => {
		cy.visit('http://localhost/swap')
	})
	const delay = 200
	const usdt = '0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2'
	// const busd = '0x092d93f258ceea20c94ba01e8771115141dd7c20'
	it('can enter an amount into input', () => {
		cy.get('#swap-currency-input .token-amount-input').type('0.001', { delay }).should('have.value', '0.001')
	})

	it('zero swap amount', () => {
		cy.get('#swap-currency-input .token-amount-input').type('0.0', { delay }).should('have.value', '0.0')
	})

	it('invalid swap amount', () => {
		cy.get('#swap-currency-input .token-amount-input').type('\\', { delay }).should('have.value', '')
	})

	it('can enter an amount into output', () => {
		cy.get('#swap-currency-output .token-amount-output').type('0.001', { delay }).should('have.value', '0.001')
	})

	it('zero output amount', () => {
		cy.get('#swap-currency-output .token-amount-output').type('0.0', { delay }).should('have.value', '0.0')
	})

	// This test requires account with some amount of ASA on it
	// Now with random private key it shows Insufficient ASA Balance button
	// it.skip('can swap ASA for USDT', () => {
	it('can swap ASA for USDT', () => {
		// cy.visit(`http://localhost/swap?inputCurrency=${busd}&outputCurrency=ASA`)
		// cy.get('#swap-currency-output .open-currency-select-button').click()
		// cy.get(`.token-item-${usdt}`).should('be.visible')
		// cy.get(`.token-item-${usdt}`).click({
		// 	force: true
		// })
		cy.get('#swap-currency-input').should('be.visible')
		cy.get('#swap-currency-input .token-amount-input').type('0.001', { force: true, delay })
		cy.get('#swap-currency-output').should('not.equal', '')
		cy.get('#swap-button').click()
		cy.get('#confirm-swap-or-send').should('contain', 'Xác nhận Hoán đổi')
	})

	it('add a recipient does not exist unless in expert mode', () => {
		cy.get('#add-recipient-button').should('not.exist')
	})

	it('should get input and output currency from url params', () => {
		cy.visit(`http://localhost/swap?inputCurrency=${usdt}&outputCurrency=ASA`)
		cy.get('#swap-currency-input #pair').should('contain', 'USDT')
		cy.get('#swap-currency-output #pair').should('contain', 'ASA')
	})

	describe('expert mode', () => {
		beforeEach(() => {
			cy.window().then(win => {
				cy.stub(win, 'prompt').returns('confirm')
			})
			cy.get('#open-settings-dialog-button').click()
			cy.get('#toggle-expert-mode-button').click({ force: true })
			cy.get('#confirm-expert-mode').click()
		})

		it('add a recipient is visible', () => {
			cy.get('#add-recipient-button').should('be.visible')
		})

		it('add a recipient', () => {
			cy.get('#add-recipient-button').click({ force: true })
			cy.get('#recipient').should('exist')
		})

		it('remove recipient', () => {
			cy.get('#add-recipient-button').click({ force: true })
			cy.get('#remove-recipient-button').click({ force: true })
			cy.get('#recipient').should('not.exist')
		})
	})
})
