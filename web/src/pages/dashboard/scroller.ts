function scroller(container: Element, sections: HTMLCollectionOf<Element>) {
	const sectionPositions: number[] = []

	let startPos = 0
	const section_len = sections.length
	for (let i = 0; i < section_len; i++) {
		const top = sections[i].getBoundingClientRect().top
		// console.log('TOP', sections[i].getBoundingClientRect(), top)
		if (i === 0) {
			startPos = top
		}
		sectionPositions.push(top - startPos)
	}

	let offset = 200

	if (window.matchMedia("(max-width: 767px)").matches) {
		offset = 0
	}

	let pos = 0
	pos = offset - container.getBoundingClientRect().top

	let sectionIndex = 0
	if (sectionPositions.length !== 0) {
		if (pos >= sectionPositions[sectionPositions.length - 1]) {
			sectionIndex = sectionPositions.length - 1
		} else {
			for (let i = 0; i < sectionPositions.length - 1; i++) {
				if (
					pos >= sectionPositions[i] &&
					pos < sectionPositions[i + 1]
				) {
					sectionIndex = i
				}
			}
		}
	}
	// console.log('node', container.node())
	// console.log('secpos', sectionPositions)
	// console.log('pos', pos)
	// console.log('sec index', sectionIndex)
	// console.log('Con start', containerStart)

	return sectionIndex
}

export default scroller
