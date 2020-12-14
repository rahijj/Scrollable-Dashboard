import * as d3 from 'd3'

function scroller(container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	els: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>, y: number) {

	let sections: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
	let sectionPositions: number[] = [];
	// let containerStart = 0;

	sections = els;

	let startPos: number = 0;
	sections.each(function (d, i: number) {
		//@ts-ignore
		let top = this.getBoundingClientRect().top;
		//@ts-ignore
		// console.log('TOP', this.getBoundingClientRect(), top)
		//@ts-ignore
		// console.log('scroller', this.getBoundingClientRect())
		if (i === 0) {
			startPos = top;
		}

		sectionPositions.push(top - startPos);

	});

	//@ts-ignore
	// containerStart = container.node().getBoundingClientRect().top + y;

	let offset = 200;

	if (window.matchMedia("(max-width: 767px)").matches) {
		offset = 0
	}

	// let pos1 = y + offset - containerStart;
	let pos: number = 0
	//@ts-ignore
	pos = offset - container.node().getBoundingClientRect().top;

	let sectionIndex;
	if (sectionPositions.length === 0) {
		sectionIndex = 0;
	}
	else {
		sectionIndex = 0

		if (pos >= sectionPositions[sectionPositions.length - 1]) {
			sectionIndex = sectionPositions.length - 1
		} else {
			for (var i = 0; i < sectionPositions.length - 1; i++) {
				if (pos >= sectionPositions[i] && pos < sectionPositions[i + 1]) {
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
	//@ts-ignore
	// console.log('cont top', container.node().getBoundingClientRect().top)


	return sectionIndex

	// let prevIndex = Math.max(sectionIndex - 1, 0);
	// let prevTop = sectionPositions[prevIndex];
	// let progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
}

export default scroller;
