/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3"

// Generates as many d3 elements as there are items in the passedData list.
export function generateElements(
	passedData: [string, any][],
	className: string,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	element = "rect"
) {
	// const t = selection.transition().duration(900);
	selection
		.selectAll("." + className)
		.data(passedData, (d, i) => i)
		.join(
			(enter) =>
				enter
					.append(element)
					.attr("class", className)
					.attr("opacity", 0.9),
			(update) => update,

			(exit) =>
				exit
					// .attr('width', 0)
					.remove()
		)
}
export function generateVertBars(
	passedData: [string, any][],
	className: string,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	linearScale: any,
	element = "rect"
) {
	// const t = selection.transition().duration(900);
	selection
		.selectAll("." + className)
		.data(passedData, (d, i) => i)
		.join(
			(enter) =>
				enter
					.append(element)
					.attr("class", className)
					.attr("opacity", 0.9)
					.attr("y", linearScale(0)),

			(update) => update,

			(exit) =>
				exit
					// .attr('width', 0)
					.remove()
		)
}

// Creates linnear and band scale for graphs
export function generateAxis(
	bandDomain: string[],
	linearDomain: [number, number],
	bandRange: [number, number],
	linearRange: [number, number]
) {
	const linearScale: any = d3
		.scaleLinear()
		.domain(linearDomain)
		.range(linearRange)

	const bandScale: any = d3.scaleBand().domain(bandDomain).range(bandRange)

	return [linearScale, bandScale]
}
export function showXAxis(
	axis: any,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerHeight = 0,
	innerWidth = 0,
	xLabel = ""
) {
	selection
		.select(".xAxis")
		// .transition().duration(1000)
		.call(axis)
	selection.select(".xAxis").selectAll(".tick text").call(wrapX, 50)

	selection
		.select(".xLabel")
		.attr("transform", `translate(${innerWidth / 2},${innerHeight + 35})`)
		.transition()
		.duration(1000)
		.text(xLabel)
		.attr("opacity", 1)
}

export function showXAxisMonth(
	axis: any,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerHeight = 0,
	innerWidth = 0,
	xLabel = ""
) {
	selection
		.select(".xAxis")
		// .transition().duration(1000)
		.call(axis)
	// selection.select('.xAxis')

	selection
		.select(".xLabel")
		.attr("transform", `translate(${innerWidth / 2},${innerHeight + 35})`)
		.transition()
		.duration(1000)
		.text(xLabel)
		.attr("opacity", 1)
}

export function showYAxis(
	axis: any,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerHeight = 0,
	innerWidth = 0,
	yLabel = "",
	margin: {
		top: number
		right: number
		bottom: number
		left: number
	} = { top: 20, right: 20, bottom: 20, left: 55 }
) {
	const t = selection.transition().duration(100)

	selection
		.select(".yAxis")
		// .transition().duration(900)
		.call(axis)
	// .selectAll('.tick text')
	// .call(wrapY, 120)

	selection.select(".yAxis").selectAll(".tick text").call(wrapY, 120)

	selection
		.select(".yLabel")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x", 0 - innerHeight / 2)
		.attr("dy", "1em")
		.transition()
		.duration(1000)
		.text(yLabel)
		.attr("opacity", 1)
}
export function plotTitle(
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerWidth = 0,
	title = "test",
	split = false,
	horzTranslate = 0
) {
	const classes = ["plotTitle"]
	const textList: string[] = []
	if (title.split(" ").length > 5 && split) {
		classes.push("plotTitle1")
		let temp = ""
		const splits = title.split(" ")
		for (let i = 0; i < 6; i++) {
			temp += " " + splits[i]
		}
		textList.push(temp)
		temp = ""
		for (let i = 6; i < title.split(" ").length; i++) {
			temp += " " + splits[i]
		}
		textList.push(temp)
	} else {
		generateElements([], "plotTitle1", selection, "text")
		textList.push(title)
	}
	let i = 0
	classes.forEach((e) => {
		if (selection.select("." + e).empty()) {
			selection.append("text").attr("class", e).attr("id", "plotTitle")
		}

		selection
			.select("." + e)
			.attr(
				"transform",
				`translate(${innerWidth / 2 + horzTranslate},${-30 + i * 20})`
			)
			.transition()
			.duration(800)
			.text(textList[i])
			.attr("opacity", 1)

		i += 1
	})
}
export function createAxis(
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerHeight = 0
) {
	if (selection.select(".yAxis").empty()) {
		selection.append("g").attr("class", "yAxis")

		selection.append("text").attr("class", "yLabel")
	}
	if (selection.select(".xAxis").empty()) {
		selection
			.append("g")
			.attr("class", "xAxis")
			.attr("transform", `translate(0,${innerHeight})`)

		selection.append("text").attr("class", "xLabel")
	} else {
		selection
			.select(".xAxis")
			.attr("transform", `translate(0,${innerHeight})`)
	}
}

export function createGrid(
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
	innerHeight: number
) {
	if (selection.select(".yGrid").empty()) {
		selection.append("g").attr("class", "yGrid")
	}
	if (selection.select(".xGrid").empty()) {
		selection
			.append("g")
			.attr("class", "xGrid")
			.attr("transform", `translate(0,${innerHeight})`)
	} else {
		selection
			.select(".xGrid")
			.attr("transform", `translate(0,${innerHeight})`)
	}
}

export function showXGrid(
	axis: any,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
) {
	selection
		.select(".xGrid")
		.attr("opacity", 0.4)
		.transition()
		.duration(1000)
		.attr("color", "grey")
		.call(axis)
}
export function showYGrid(
	axis: any,
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
) {
	selection
		.select(".yGrid")
		.attr("opacity", 0.4)
		.transition()
		.duration(1000)
		.attr("color", "grey")
		.call(axis)
}

export function getConfInt(array: number[]) {
	const n = array.length
	if (n !== 0) {
		const mean = array.reduce((a, b) => a + b) / n
		const sd = Math.sqrt(
			array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
		)
		const CI_1 = mean + 1.96 * (sd / Math.sqrt(n))
		const CI_2 = mean - 1.96 * (sd / Math.sqrt(n))
		return [CI_1, CI_2]
	} else {
		return [0, 0]
	}
}
export function showtip(
	d: any,
	tooltipTable: Record<string, Record<string, string>>,
	tableBody: any
) {
	const match = d[0]
	// console.log('tip', d, tooltipTable)
	if (match in tooltipTable) {
		let check = 0
		const rowList = Object.entries(tooltipTable[match])
		generateElements(rowList, "tr", tableBody, "tr")
		const rows = d3.selectAll(".tr")
		const cells = rows
			.selectAll("td")
			.data((d: any) => d)
			.join(
				(enter) =>
					enter
						.append("td")
						.attr("class", "td")
						.style("color", (d) => {
							if (check === 1) {
								check = 0
								if (Number(d) < 50) return "#ed5757"
							}
							if (d === "Count") {
								check = 1
							} else check = 0
							return "white"
						})
						.text((d: any) => d),
				(update) =>
					update
						.style("color", (d) => {
							if (check === 1) {
								check = 0
								if (Number(d) < 50) return "#ed5757"
							}
							if (d === "Count") {
								check = 1
							} else check = 0
							return "white"
						})
						.text((d: any) => d),
				(exit) => exit.remove()
			)
	} else {
		generateElements([["rows", 1]], "tr", tableBody, "tr")
		const rows = d3.selectAll(".tr")
		generateElements([["td", 1]], "td", rows, "td")
		const cells = d3.selectAll(".td")
		cells.text(d[1].toFixed(2) + "%")
	}
}

interface highlightIncome {
	data: [string, number][]
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	bandScale: any
	linearScale: any
	className?: string
	tooltipTable: Record<string, Record<string, string>>
	month?: boolean
	tooltipClass?: string
	color?: string
	id?: string
}
export function highlightLine({
	data,
	selection,
	bandScale,
	linearScale,
	className = "Point",
	tooltipTable = { Value: { Value: "0 " } },
	month = false,
	tooltipClass = "tooltip",
	color = "#DAA520",
	id = "Point",
}: highlightIncome) {
	const mOutColor = "#9c9c9c"
	const t = selection.transition().duration(1100)

	// console.log('data', data)
	selection
		.selectAll("." + className)
		.data(data)
		.join(
			(enter) =>
				enter
					.append("circle")
					.attr("class", className)
					.attr("id", id)
					.attr("opacity", 1)
					.attr("cx", (d) => {
						if (month) {
							// console.log('here', d)
							let ind = d[0].indexOf("#")
							if (ind == -1) {
								ind = d[0].length
							}
							return bandScale(
								new Date(2020, Number(d[0].slice(0, ind)), 1)
							)
						} else if (!month) {
							return bandScale(d[0])
						}
					})
					.attr("cy", (d) => {
						return linearScale(d[1])
					})
					.call((s) => s.transition(t).attr("r", 5)),
			(update) =>
				update.call((s) =>
					s
						.transition(t)
						.attr("cx", (d) => {
							if (month) {
								// console.log('here', d)
								let ind = d[0].indexOf("#")
								if (ind == -1) {
									ind = d[0].length
								}
								return bandScale(
									new Date(
										2020,
										Number(d[0].slice(0, ind)),
										1
									)
								)
							} else {
								return bandScale(d[0])
							}
						})
						.attr("cy", (d) => {
							return linearScale(d[1])
						})
						.attr("opacity", 1)
						.attr("r", 5)
				),
			(exit) =>
				exit
					// .attr('width', 0)
					.transition()
					.duration(200)
					.attr("r", 0)
					.remove()
		)

	generateElements(
		[["tooltip", 1]],
		tooltipClass,
		d3.selectAll(".vis"),
		"div"
	)
	const tooltip = d3.selectAll("." + tooltipClass).style("display", "none")
	generateElements([["table", 1]], "table", tooltip, "table")
	const table = tooltip.selectAll(".table")
	//@ts-ignore
	generateElements([["tbody", 1]], "tbody", table, "tbody")
	const tableBody = table.selectAll(".tbody")

	selection
		.selectAll("." + className)
		//@ts-ignore
		.on("mouseover", (event, d: [string, number]) => {
			// console.log('wtf', d)
			changeRadius(d)
			showtip(d, tooltipTable, tableBody)
			tooltip
				.style("left", () => {
					if (month) {
						let ind = d[0].indexOf("#")
						if (ind == -1) {
							ind = d[0].length
						}
						return (
							bandScale(
								new Date(2020, Number(d[0].slice(0, ind)), 1)
							) -
							20 +
							"px"
						)
					} else {
						return bandScale(d[0]) - 20 + "px"
					}
				})
				.style("top", linearScale(d[1]) + 85 + "px")
				.style("display", "block")
		})
		.on("mouseout", () => {
			tooltip.style("display", "none")
			selection
				.selectAll("." + className)
				.attr("r", 5)
				.style("fill", mOutColor)
		})

	const changeRadius = (d: [string, number]) => {
		d3.selectAll("." + className)
			.attr("r", (e) => {
				let temp
				d === e ? (temp = 12) : (temp = 7)
				return temp
			})
			.style("fill", (e) => {
				let temp
				d === e ? (temp = color) : (temp = mOutColor)
				return temp
			})
	}
}

interface highlightBarType {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	bandScale: any
	linearScale: any
	className: string
	margin: {
		top: number
		right: number
		bottom: number
		left: number
	}
	tooltipTable: Record<string, Record<string, string>>
	tooltipClass?: string
	translate?: number
}
export function highlightBar({
	selection,
	bandScale,
	linearScale,
	className = "BarGraph",
	margin = { top: 20, right: 20, bottom: 20, left: 55 },
	tooltipTable = { Value: { Value: "0 " } },
	tooltipClass = "tooltip",
}: highlightBarType) {
	generateElements(
		[["tooltip", 1]],
		tooltipClass,
		d3.selectAll(".vis"),
		"div"
	)
	const tooltip = d3.selectAll("." + tooltipClass).style("display", "none")
	generateElements([["table", 1]], "table", tooltip, "table")
	const table = tooltip.selectAll(".table")
	//@ts-ignore
	generateElements([["tbody", 1]], "tbody", table, "tbody")
	const tableBody = table.selectAll(".tbody")

	selection
		.selectAll("." + className)
		//@ts-ignore
		.on("mouseover", (event, d: [string, number]) => {
			// console.log('bar', d.path[0].__data__[0])
			showtip(d, tooltipTable, tableBody)
			tooltip
				.style("left", linearScale(d[1]) + margin.left + 5 + "px")
				.style("top", bandScale(d[0]) + margin.top + "px")
				.style("display", "block")
		})
		.on("mouseout", () => {
			tooltip.style("display", "none")
		})
}

export function highlightVertBar({
	selection,
	bandScale,
	linearScale,
	className = "BarGraph",
	margin = { top: 20, right: 20, bottom: 20, left: 55 },
	tooltipTable = { Value: { Value: "0 " } },
	tooltipClass = "tooltip",
	translate = 0,
}: highlightBarType) {
	generateElements(
		[["tooltip", 1]],
		tooltipClass,
		d3.selectAll(".vis"),
		"div"
	)
	const tooltip = d3.selectAll("." + tooltipClass).style("display", "none")
	generateElements([["table", 1]], "table", tooltip, "table")
	const table = tooltip.selectAll(".table")
	//@ts-ignore
	generateElements([["tbody", 1]], "tbody", table, "tbody")
	const tableBody = table.selectAll(".tbody")

	selection
		.selectAll("." + className)
		.on("mouseover", (event, d: any) => {
			showtip(Object.values(d), tooltipTable, tableBody)
			tooltip
				.style(
					"top",
					linearScale(linearScale.domain()[0] + Object.values(d)[1]) +
						"px"
				)
				.style(
					"left",
					bandScale(Object.values(d)[0]) +
						translate +
						margin.left +
						15 +
						"px"
				)
				.style("display", "block")
		})
		.on("mouseout", () => {
			tooltip.style("display", "none")
		})
}

export function showLegend(
	ItemsColours: Record<string, string>,
	selection: any
) {
	const Items = Object.entries(ItemsColours)
	const leg = selection.selectAll(".legend")

	generateElements(Items, "legendCircle", leg, "circle")
	generateElements(Items, "legendText", leg, "text")

	let n = -15
	leg.selectAll(".legendCircle")
		.attr("id", "legendShape")
		.attr("transform", () => {
			n += 15
			return `translate(${0},${n})`
		})
		.transition()
		.duration(900)
		.attr("r", 4)
		.style("fill", (d: any) => d[1])

	let nt = -15
	leg.selectAll(".legendText")
		.attr("id", "legendText")
		.attr("transform", () => {
			nt += 15
			return `translate(${20},${nt})`
		})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.text((d: any) => d[0])
		.attr("opacity", 1)
		.attr("dominant-baseline", "middle")
}

export function showLegendDot(
	ItemsColours: Record<string, string>,
	selection: any,
	marginTop = false,
	totalItems = 1
) {
	const Items = Object.entries(ItemsColours)
	const leg = selection.selectAll(".legend")

	generateElements(Items, "legendDot", leg, "line")
	generateElements(Items, "legendDotText", leg, "text")

	let n = -15
	let nt = -15

	if (marginTop == true) {
		n += totalItems * 15
		nt += totalItems * 15
	}
	leg.selectAll(".legendDot")
		.attr("id", "legendShape")
		.attr("transform", () => {
			n += 15
			return `translate(${-10},${n})`
		})
		.attr("x1", 0)
		.attr("y1", 0)
		.transition()
		.duration(900)
		.attr("x2", 22)
		.attr("y2", 0)
		.style("stroke-dasharray", "3,3") //dashed array for line
		.style("stroke-width", "3px")
		.style("stroke", (d: any) => d[1])

	leg.selectAll(".legendDotText")
		.attr("id", "legendText")
		.attr("transform", () => {
			nt += 15
			return `translate(${20},${nt})`
		})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.text((d: any) => d[0])
		.attr("opacity", 1)
		.attr("dominant-baseline", "middle")
}

export function wrapY(text: any, width: any) {
	text.each((d: any, i: any, n: any) => {
		let text = d3.select(n[i]),
			words = text.text().split(/\s+/).reverse(),
			word,
			line: string[] = [],
			lineHeight = 0.9, // em
			tspan = text.text(null).append("tspan").attr("x", -9) //.attr("dy", 0.31 + "em");
		while ((word = words.pop())) {
			line.push(word)
			tspan.text(line.join(" "))
			//@ts-ignore
			if (tspan.node().getComputedTextLength() > width) {
				line.pop()
				tspan.text(line.join(" "))
				line = [word]
				tspan = text
					.append("tspan")
					.attr("x", -9)
					.attr("dy", lineHeight + "em")
					.text(word)
			}
		}
	})
}

export function wrapX(text: any, width: any) {
	text.each((d: any, i: any, n: any) => {
		let text = d3.select(n[i]),
			words = text.text().split(/\s+/).reverse(),
			word,
			line: string[] = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y)
		while ((word = words.pop())) {
			line.push(word)
			tspan.text(line.join(" "))
			//@ts-ignore
			if (tspan.node().getComputedTextLength() > width) {
				line.pop()
				tspan.text(line.join(" "))
				line = [word]
				tspan = text
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word)
			}
		}
	})
}
interface makeLineMonth {
	gLinks: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	bandScale: any
	linearScale: any
	passedList?: [string, number][][]
	passedExpList?: [string, number][][]
	type?: string
	Colors?: string[]
}
export function makeLineMonth({
	gLinks,
	bandScale,
	linearScale,
	passedList = [],
	passedExpList = [],
	type = "normal",
	Colors = ["#344a62", "orange", "grey"],
}: makeLineMonth) {
	const line: any = d3
		.line()
		.x((d) => {
			return bandScale(new Date(2020, d[0], 1))
		})
		.y((d) => linearScale(d[1]))

	let className: string
	const element = "path"
	const strokeWidth = "3"
	const t = gLinks.transition().delay(750).duration(500)
	let data: [string, number][][]
	type == "Exp" ? (data = passedExpList) : (data = passedList)
	type == "Exp" ? (className = "LineExpected") : (className = "LineNorm")

	gLinks
		.selectAll("." + className)
		.data(data)
		.join(
			(enter) =>
				enter
					.append(element)
					.attr("id", className)
					.attr("class", className)
					.attr("opacity", 0.9)
					.attr("fill", "none")
					.style("stroke-dasharray", () => {
						if (type == "Exp") {
							return "3, 3"
						}
						return "none"
					})
					.style("stroke", (d, i) => {
						return Colors[i]
					})
					.style("stroke-width", "0")
					.call((s) =>
						s
							.transition(t)
							.style("stroke-width", strokeWidth)
							.attr("d", line)
					),
			(update) =>
				update
					.attr("opacity", 0.9)
					.attr("id", className)
					.attr("fill", "none")
					.style("stroke-dasharray", () => {
						if (type == "Exp") {
							return "3, 3"
						}
						return "none"
					})
					.call((s) =>
						s
							.transition(t)
							.style("stroke", (d, i) => {
								return Colors[i]
							})
							.style("stroke-width", strokeWidth)
							.attr("d", line)
					),
			(exit) =>
				exit
					.transition()
					.duration(500)
					.style("stroke-width", "0")
					.remove()
		)
}

interface FlattenNodes {
	targetList: [string, number][]
	origList: [string, number][][]
}
export function flattenNodes({ targetList = [], origList }: FlattenNodes) {
	let nLoop = 0
	origList.forEach((e) => {
		e.forEach((i) => {
			targetList.push([i[0] + "#" + String(nLoop), i[1]])
		})
		nLoop += 1
	})
	return targetList
}
