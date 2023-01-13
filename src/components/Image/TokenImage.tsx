import clsx from 'clsx'
import Image from './Image'
import styles from './styles.module.scss'

// eslint-disable-next-line jsx-a11y/alt-text
const TokenImage = props => <Image className={clsx(styles.tokenImage, props.className)} {...props} />

export default TokenImage
