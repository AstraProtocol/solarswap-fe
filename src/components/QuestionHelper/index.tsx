// import { HelpIcon, useTooltip, Box, BoxProps, Placement } from '@solarswap/uikit'
// import styled from 'styled-components'

// interface Props extends BoxProps {
// 	text: string | React.ReactNode
// 	placement?: Placement
// 	size?: string
// }

// const QuestionWrapper = styled.div`
// 	:hover,
// 	:focus {
// 		opacity: 0.7;
// 	}
// `

const QuestionHelper = ({ text, placement = 'right-end', size = '16px', ...props }) => {
	// const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement, trigger: 'hover' })

	return (
		<div {...props}>
			{/* <QuestionWrapper ref={targetRef}> */}
			{/* <HelpIcon color="textSubtle" width={size} /> */}
			{/* </QuestionWrapper> */}
		</div>
	)
}

export default QuestionHelper
