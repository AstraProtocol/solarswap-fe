import React, { useEffect, useRef, useState } from 'react'
import observerOptions from './options'
import Wrapper from './Wrapper'
import Placeholder from './Placeholder'
import styles from './styles.module.scss'
import NextImage from 'next/image'

const Image = ({ src, alt, width, height, ...props }) => {
	const imgRef = useRef<HTMLDivElement>(null)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		let observer: IntersectionObserver
		const isSupported = typeof window === 'object' && window.IntersectionObserver

		if (imgRef.current && isSupported) {
			observer = new window.IntersectionObserver(entries => {
				entries.forEach(entry => {
					const { isIntersecting } = entry
					if (isIntersecting) {
						setIsLoaded(true)
						if (typeof observer?.disconnect === 'function') {
							observer.disconnect()
						}
					}
				})
			}, observerOptions)
			observer.observe(imgRef.current)
		}

		return () => {
			if (typeof observer?.disconnect === 'function') {
				observer.disconnect()
			}
		}
	}, [src])

	return (
		<Wrapper ref={imgRef} height={height} width={width} {...props}>
			{isLoaded ? (
				<NextImage height={height} width={width} className={styles.imageComponent} src={src} alt={alt} />
			) : (
				<Placeholder />
			)}
		</Wrapper>
	)
}

export default Image
