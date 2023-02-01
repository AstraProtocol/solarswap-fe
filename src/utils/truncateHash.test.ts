import truncateHash from './truncateHash'

describe('truncate hash ellipse between', () => {
	it('should return first 8', () => {
		const result = truncateHash('0x3a8466ab929d7148c6db0e4ca144bc259c4ef96916819be14f3e1ab486ea491b', 8, 0)
		expect(result).toBe('0x3a8466...')
	})
	it('should return first 8 and last 8 characters', () => {
		const result = truncateHash('0x3a8466ab929d7148c6db0e4ca144bc259c4ef96916819be14f3e1ab486ea491b', 8, 8)
		expect(result).toBe('0x3a8466...86ea491b')
	})
})
