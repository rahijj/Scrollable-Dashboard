import React from 'react'

const Input = () => {

	const [count, setCount] = React.useState(0)

	return <div className="container mx-auto py-10 bg-gray-100">

		<div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl p-5 text-center">
			Hello <span className="font-bold text-lg">{count}</span>

			<div className="flex space-x-2 container justify-center">
				<div onClick={() => setCount(count - 1)} className="btn btn-red">-</div>
				<div onClick={() => setCount(count + 1)} className="btn btn-green">+</div>
			</div>

		</div>

	</div>
}

export default Input