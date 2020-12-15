const debounce = (f: Function, wait: number): Function => {
	let timeout: NodeJS.Timeout

	return (...args: never[]) => {
		//@ts-ignore
		const fncall = () => f.apply(this, args)

		clearTimeout(timeout)
		timeout = setTimeout(fncall, wait)
	}
}

export default debounce
