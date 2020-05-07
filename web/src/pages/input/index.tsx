import React from 'react'
import { get_host } from 'config'

export default () => {

	const [count, setCount] = React.useState(0)

	return <div>
		Hello {count}

		<div>
			<button onClick={() => setCount(count - 1)}>-</button>
			<button onClick={() => setCount(count + 1)}>+</button>
		</div>

	</div>
}