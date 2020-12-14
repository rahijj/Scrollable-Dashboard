
import React from 'react'

interface P {
	loading: boolean
}
const Loading: React.FC<P> = ({ loading }) => {

	return <div className='loading'>
		{loading &&
			<div className="sk-chase">
				<div className="sk-chase-dot"></div>
				<div className="sk-chase-dot"></div>
				<div className="sk-chase-dot"></div>
				<div className="sk-chase-dot"></div>
				<div className="sk-chase-dot"></div>
				<div className="sk-chase-dot"></div>
			</div>}
		{!loading && <div className="scrollArrow">
			<div className="chevron"></div>
			<div className="chevron"></div>
			<div className="chevron"></div>
			<div className="scrollDownText">Scroll Down</div>
		</div>}
	</div>
}
export default Loading;