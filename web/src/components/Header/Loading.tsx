import React from "react"

interface P {
	loading: boolean
}
const Loading: React.FC<P> = ({ loading }) => {
	return (
		<div className="loading flex w-3/4 md:w-full fixed opacity-0 z-50 left-0 ml-21.5% md:ml-0 top-1/3 justify-center items-center pointer-events-none animate-disappear">
			{loading && (
				<div className="loader ease-linear animate-spinner rounded-full border-4 border-gray-200 z-50 w-12 h-12 fixed items-center text-center"></div>
				// <div className="fixed animate-spin h-12 w-12 items-center text-center bg-black"></div>
			)}
			{!loading && (
				<div className="scrollArrow flex justify-center items-center font-light bg-black opacity-70 mx-auto top-1/4 w-3/5 rounded-xl pointer-events-none">
					<div className="arrow fixed animate-bounce mt-12">
						<div className="arrow border-t-0 border-r-8 border-b-8 border-l-0 block p-3 transform rotate-45 border-gray-200"></div>
						<div className="arrow border-t-0 border-r-8 border-b-8 border-l-0 block p-3 transform rotate-45 border-gray-200"></div>
					</div>
					<div className="scrollDownText text-gray-200 mt-12 pb-28 text-3xl">
						Scroll Down
					</div>
				</div>
			)}
		</div>
	)
}
export default Loading
