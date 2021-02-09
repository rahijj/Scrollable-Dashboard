import * as d3 from "d3"

/**
 * Generates as many elements as there are items in the data list.
 *
 * @param  {} data
 * @param  {} className
 * ClassName for elements.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} element='div'
 * Element to be created, by default set to div.
 */
export function generateElements({
	data,
	className,
	selection,
	element = "div",
}: {
	data: any[]
	className: string
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	element?: string
}) {
	selection
		.selectAll("." + className)
		.data(data, (d, i) => i)
		.join(
			(enter) => enter.append(element).attr("class", className),
			(update) => update,
			(exit) => exit.remove()
		)
}

interface GenHorzBars {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	data: DataObjType[]
	x_scale: d3.ScaleLinear<number, number>
	y_scale: any
}
/**
 * This function creates a Horizontal Bar graph inside the svg element 'selection'.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} data
 * List of DataObjType's.
 *
 * @param  {} x_scale
 * @param  {GenHorzBars} y_scale}
 */
export function generateHorzBars({
	selection,
	data,
	x_scale,
	y_scale,
}: GenHorzBars) {
	const t = selection.transition().duration(650)

	selection
		.selectAll(".BarGraph")
		.data(data)
		.join(
			(enter) =>
				enter
					.append("rect")
					.attr(
						"class",
						"BarGraph fill-current text-cerp-navy hover:text-yellow-500"
					)
					.attr("height", y_scale.bandwidth())
					.attr("y", (d) => {
						return y_scale(d.Y)
					})
					.call((s) =>
						s
							.transition(t)
							.attr("width", (d) =>
								Math.max(0, x_scale(Number(d.X)))
							)
							.attr("x", 0)
							.delay((d, i) => i * 50)
					),
			(update) =>
				update
					.attr("height", y_scale.bandwidth())
					//@ts-ignore
					.attr("y", (d) => {
						return y_scale(d.Y)
					})
					.call((s) =>
						s
							.transition(t)
							.attr("width", (d) =>
								Math.max(0, x_scale(Number(d.X)))
							)
							.attr("x", 0)
							.delay((d, i) => i * 50)
					),

			(exit) => exit.remove()
		)
}

interface generateLineGraph {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	x_scale: any
	y_scale: any
	passedList?: DataObjType[][]
	type?: string
	Colors?: string[]
}
/**
 * This function generates a line graph inside the gLinks group element.
 *
 * @param  {} gLinks
 * Group parent element with class name '.links'. The line is made
 * inside this element and the nodes in the '.nodes' group element
 * generated in the start to prevent overlapp of the nodes and the line.
 *
 * @param  {} x_scale
 * @param  {} y_scale
 * @param  {} passedList=[]
 *
 * @param  {} type='normal'
 * There are 2 types. If type is 'Exp' (Expected line), a dotted line will
 * be created.
 *
 * @param  {} Colors
 * The colors for each of the lines being displayed in 1 graph, if the
 * number of liines exceed the number of colors, a default oramge color
 * will be used for the lines.
 */
export function generateLineGraph({
	selection,
	x_scale,
	y_scale,
	passedList = [],
	type = "normal",
	Colors = ["#344a62", "orange", "grey"],
}: generateLineGraph) {
	const line = d3
		.line<DataObjType>()
		.x((d) => {
			return x_scale(d.X)
		})
		.y((d) => y_scale(d.Y))

	let className: string
	const element = "path"
	const strokeWidth = "3"
	const data: DataObjType[][] = passedList
	type == "Exp" ? (className = "LineExpected") : (className = "LineGraph")

	selection
		.selectAll(".links")
		.data([2], (d, i) => i)
		.join(
			(enter) => enter.append("g").attr("class", "links ordered"),
			(update) => update,
			(exit) => exit.remove()
		)
	const gLinks = selection.selectAll(".links")
	const t = gLinks.transition().delay(750).duration(500)

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
						if (i < Colors.length) {
							return Colors[i]
						}
						return "orange"
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
								if (i < Colors.length) {
									return Colors[i]
								}
								return "orange"
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

interface Tooltip {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	className: string
	xTranslate: number
	yTranslate: number
	x_scale: any
	y_scale: any
}
/**
 * This function creates a tooltip on mouseover over a data node and displayes the
 * binded data.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} className
 * This is the class name for the element to which data has been binded too and that data
 * will be displayed on mouseover by a hovering table (tooltip).
 *
 * @param  {} xTranslate
 * @param  {} yTranslate
 * 'x' and 'y' direction adjustments for the hovering tooltip.
 *
 * @param  {} x_scale
 * @param  {} y_scale
 */
function create_tooltip({
	selection,
	className,
	xTranslate,
	yTranslate,
	x_scale,
	y_scale,
}: Tooltip) {
	d3.selectAll(".vis")
		.selectAll(".tooltip")
		.data([1])
		.join(
			(enter) =>
				enter
					.append("div")
					.attr(
						"class",
						"tooltip font-bold absolute bg-black opacity-50 p-3 rounded-xl pointer-events-none animate-float"
					)
					.style("display", "none")
					.attr("opacity", 0.9),
			(update) => update,
			(exit) => exit.remove()
		)
	const tooltip = d3.selectAll("." + "tooltip").style("display", "none")
	generateElements({
		data: [["table"]],
		className: "table",
		selection: tooltip,
		element: "table",
	})
	const table = tooltip.selectAll(".table")
	generateElements({
		data: [["tbody"]],
		className: "tbody",
		//@ts-ignore
		selection: table,
		element: "tbody",
	})
	const tableBody = table.selectAll(".tbody")

	selection
		.selectAll("." + className)
		.on(
			"mouseover",
			//@ts-ignore
			function (this, event, d: Record<string, number | Date | string>) {
				d3.select(this).attr("r", 12)
				let check = 0
				const initialState: [string, string][] = []
				const options = { month: "long" }

				const rowList = Object.entries(d).reduce((agg, curr) => {
					if (typeof curr[1] == "object") {
						agg.push([
							curr[0],
							new Intl.DateTimeFormat("en-US", options).format(
								curr[1]
							),
						])
					} else {
						agg.push([curr[0], String(curr[1])])
					}
					return agg
				}, initialState)
				generateElements({
					data: rowList,
					className: "tr",
					//@ts-ignore
					selection: tableBody,
					element: "tr",
				})
				const rows = d3.selectAll(".tr")
				rows.selectAll("td")
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
				tooltip
					.style("left", () => {
						return x_scale(d.X) + xTranslate + "px"
					})
					.style("top", y_scale(d.Y) + yTranslate + "px")
					.style("display", "block")
			}
		)
		.on("mouseout", function (this) {
			tooltip.style("display", "none")
			d3.select(this).attr("r", 5)
		})
}

interface HighlightLine {
	data: DataObjType[]
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	x_scale: any
	y_scale: any
	className?: string
}
/**
 * This function creates circles over data points in a Line Graph, and also
 * calls the create_tooltip function over those data points.
 *
 * @param  {} data
 * List of DataObjType's.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} x_scale
 * @param  {} y_scale
 *
 * @param  {} className='Point'
 * The class name for the circles to be created.
 */
export function highlightLine({
	data,
	selection,
	x_scale,
	y_scale,
	className = "Point",
}: HighlightLine) {
	const t = selection.transition().duration(1100)

	selection
		.selectAll(".nodes")
		.data([3], (d, i) => i)
		.join(
			(enter) => enter.append("g").attr("class", "nodes ordered"),
			(update) => update,
			(exit) => exit.remove()
		)
	const gNodes = selection.selectAll(".nodes")

	gNodes
		.selectAll("." + className)
		.data(data)
		.join(
			(enter) =>
				enter
					.append("circle")
					.attr(
						"class",
						className +
							" fill-current text-gray-500 hover:text-yellow-500"
					)
					.attr("opacity", 1)
					.attr("cx", (d) => {
						return x_scale(d.X)
					})
					.attr("cy", (d) => {
						return y_scale(d.Y)
					})
					.call((s) => s.transition(t).attr("r", 5)),
			(update) =>
				update.call((s) =>
					s
						.transition(t)
						.attr("cx", (d) => {
							return x_scale(d.X)
						})
						.attr("cy", (d) => {
							return y_scale(d.Y)
						})
						.attr("opacity", 1)
						.attr("r", 5)
				),
			(exit) => exit.transition().duration(200).attr("r", 0).remove()
		)

	create_tooltip({
		selection: selection,
		className: className,
		xTranslate: -20,
		yTranslate: 85,
		x_scale: x_scale,
		y_scale: y_scale,
	})
}

interface HighlightBarType {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	y_scale: any
	x_scale: any
	margin: {
		top: number
		right: number
		bottom: number
		left: number
	}
	className?: string
	translate?: number
}
/**
 * * This function calls the create_tooltip function over the bars.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} y_scale
 * @param  {} x_scale
 *
 * @param  margin
 * The margin determines that by how much the svg element has been translated to make room
 * for the Plot Title and X & Y labels.
 *
 * @param  {} className='BarGraph'
 * By default all bar graphs have className 'BarGraph', This is changed for the clustered
 * Bar Graph so that the tooltip can differentiate between bars on the same graph.
 *
 * @param  {} translate=0
 * For clustered graphs the Y translate value is provided to shift the tooltip.
 */
export function highlightHorzBar({
	selection,
	y_scale,
	x_scale,
	margin = { top: 20, right: 20, bottom: 20, left: 55 },
	className = "BarGraph",
	translate = 0,
}: HighlightBarType) {
	create_tooltip({
		selection: selection,
		className: className,
		xTranslate: margin.left + 20,
		yTranslate: margin.top + translate,
		x_scale: x_scale,
		y_scale: y_scale,
	})
}

/**
 * This function calls the create_tooltip function over the bars.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} y_scale
 * @param  {} x_scale
 *
 * @param  margin
 * The margin determines that by how much the svg element has been translated to make room
 * for the Plot Title and X & Y labels.
 *
 * @param  {} className='BarGraph'
 * By default all bar graphs have className 'BarGraph', This is changed for the clustered
 * Bar Graph so that the tooltip can differentiate between bars on the same graph.
 *
 * @param  {} translate=0
 * For clustered graphs the X translate value is provided to shift the tooltip.
 */
export function highlightVertBar({
	selection,
	y_scale,
	x_scale,
	margin = { top: 20, right: 20, bottom: 20, left: 55 },
	className = "BarGraph",
	translate = 0,
}: HighlightBarType) {
	create_tooltip({
		selection: selection,
		className: className,
		xTranslate: translate + margin.left,
		yTranslate: -5,
		x_scale: x_scale,
		y_scale: y_scale,
	})
}

// Creates linear and band scale for graphs
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

/**
 * This function creates the Plot title.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} innerWidth=0
 * Needed to centre Title horizontally.
 *
 * @param  {} title='Title'
 *
 * @param  {} split=false
 * If true, the title will split into two lines when length of title exceeds
 * 5 words.
 *
 * @param  {} horzTranslate=0
 * Translate the title horizontally.
 */
export function plotTitle({
	selection,
	innerWidth = 0,
	title = "Title",
	horzTranslate = 0,
}: {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	innerWidth?: number
	title?: string
	horzTranslate?: number
}) {
	const classes = ["plotTitle"]
	const textList: string[] = []
	if (
		title.split(" ").length > 5 &&
		window.matchMedia("(max-width: 767px)").matches
	) {
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
		generateElements({
			data: [],
			className: "plotTitle1",
			selection,
			element: "text",
		})
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

/**
 * This Function creates the X & Y Axis and labels.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} innerHeight=0
 * Needed to centre Y label vertically.
 *
 * @param  {} innerWidth=0
 * Needed to centre X label horizontally.
 *
 * @param  {} xAxis
 * @param  {} yAxis
 * @param  {} xLabel=''
 * @param  {} yLabel=''
 *
 * @param  {} margin
 * Left margin needed to move y label to the left of y axis.
 */
export function createAxis({
	selection,
	innerHeight = 0,
	innerWidth = 0,
	xAxis,
	yAxis,
	xLabel = "",
	yLabel = "",
	leftMargin = 55,
}: {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	xAxis: any
	yAxis: any
	innerHeight?: number
	innerWidth?: number
	xLabel?: string
	yLabel?: string
	leftMargin?: number
}) {
	if (selection.select(".yAxis").empty()) {
		selection.append("g").attr("class", "yAxis")
		selection.append("text").attr("class", "yLabel")
	}
	if (selection.select(".xAxis").empty()) {
		selection.append("g").attr("class", "xAxis")

		selection.append("text").attr("class", "xLabel")
	}
	selection.select(".yAxis").call(yAxis)
	selection.select(".yAxis").selectAll(".tick text").call(wrapY, 120)
	selection
		.select(".yLabel")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - leftMargin)
		.attr("x", 0 - innerHeight / 2)
		.attr("dy", "1em")
		.transition()
		.duration(1000)
		.text(yLabel)
		.attr("opacity", 1)

	selection
		.select(".xAxis")
		.call(xAxis)
		.attr("transform", `translate(0,${innerHeight})`)
	selection.select(".xAxis").selectAll(".tick text").call(wrapX, 50)

	selection
		.select(".xLabel")
		.attr("transform", `translate(${innerWidth / 2},${innerHeight + 35})`)
		.transition()
		.duration(1000)
		.text(xLabel)
		.attr("opacity", 1)
}

/**
 * This function creates the Grid lines
 *
 * @param  {} selection
 * Selected Parent element.
 *
 * @param  {} innerHeight
 * Requires innerheight to move grid downwards.
 */
export function createGrid({
	selection,
	xAxis,
	yAxis,
	innerHeight,
}: {
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	xAxis: any
	yAxis: any
	innerHeight: number
}) {
	selection
		.selectAll(".grid")
		.data([0], (d, i) => i)
		.join(
			(enter) => enter.append("g").attr("class", "grid ordered"),
			(update) => update,
			(exit) => exit.remove()
		)
	const grid = selection.select(".grid")

	grid.selectAll(".xGrid")
		.data([0], (d, i) => i)
		.join(
			(enter) =>
				enter
					.append("g")
					.attr("class", "xGrid")
					.attr("transform", `translate(0,${innerHeight})`)
					.attr("opacity", 0.4)
					.attr("color", "grey")
					.call(xAxis),
			(update) =>
				update
					.attr("transform", `translate(0,${innerHeight})`)
					.attr("opacity", 0.4)
					.attr("color", "grey")
					.call(xAxis),
			(exit) => exit.remove()
		)
	grid.selectAll(".yGrid")
		.data([0], (d, i) => i)
		.join(
			(enter) =>
				enter
					.append("g")
					.attr("class", "yGrid")
					.attr("opacity", 0.4)
					.attr("color", "grey")
					.call(yAxis),
			(update) =>
				update.attr("opacity", 0.4).attr("color", "grey").call(yAxis),
			(exit) => exit.remove()
		)
	if (grid.select(".yGrid").empty()) {
		grid.append("g").attr("class", "yGrid")
	}
	if (grid.select(".xGrid").empty()) {
		grid.append("g")
			.attr("class", "xGrid")
			.attr("transform", `translate(0,${innerHeight})`)
	} else {
		grid.select(".xGrid").attr("transform", `translate(0,${innerHeight})`)
	}
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

/**
 *This function creates the legend.

 * @param  {} ItemsColours
 * An Object containing the legend text and color.
 *
 * @param  {} selection
 * Selected Parent element.
 *
 */
export function showLegend({
	ItemsColours,
	selection,
}: {
	ItemsColours: Record<string, string>
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
}) {
	const Items = Object.entries(ItemsColours)

	selection
		.selectAll(".legend")
		.data([4], (d, i) => i)
		.join(
			(enter) => enter.append("g").attr("class", "legend ordered"),
			(update) => update,
			(exit) => exit.remove()
		)

	const leg = selection.select(".legend")

	generateElements({
		data: Items,
		className: "legendCircle",
		selection: leg,
		element: "circle",
	})
	generateElements({
		data: Items,
		className: "legendText",
		selection: leg,
		element: "text",
	})

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

/**
 *This function creates the legend for dotted lines.

 * @param  {} ItemsColours
 * An Object containing the legend text and color.
 *
 * @param  {} selection
 * Selected Parent element.
 */
export function showLegendDot({
	ItemsColours,
	selection,
}: {
	ItemsColours: Record<string, string>
	selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
}) {
	const Items = Object.entries(ItemsColours)

	selection
		.selectAll(".legend")
		.data([4], (d, i) => i)
		.join(
			(enter) => enter.append("g").attr("class", "legend ordered"),
			(update) => update,
			(exit) => exit.remove()
		)

	const leg = selection.select(".legend")

	const totalItems = leg.selectAll(".legendCircle").size()

	generateElements({
		data: Items,
		className: "legendDot",
		selection: leg,
		element: "line",
	})
	generateElements({
		data: Items,
		className: "legendDotText",
		selection: leg,
		element: "text",
	})

	let n = -15
	let nt = -15

	if (totalItems > 0) {
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

/**
 * @param  {d3.Selection<d3.BaseType} text
 * These are the passed selected tick elements
 *
 * @param  {number} width
 * The threshold for splitting text.
 */
export function wrapY(
	text: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>,
	width: number
) {
	text.each((d, i, n) => {
		let selection = d3.select(n[i]),
			words = selection.text().split(/\s+/).reverse(),
			word,
			line: string[] = [],
			lineHeight = 0.9, // em
			tspan = selection.text(null).append("tspan").attr("x", -9) //.attr("dy", 0.31 + "em");
		while ((word = words.pop())) {
			line.push(word)
			tspan.text(line.join(" "))
			//@ts-ignore
			if (tspan.node().getComputedTextLength() > width) {
				line.pop()
				tspan.text(line.join(" "))
				line = [word]
				tspan = selection
					.append("tspan")
					.attr("x", -9)
					.attr("dy", lineHeight + "em")
					.text(word)
			}
		}
	})
}
/**
 * @param  {d3.Selection<d3.BaseType} text
 * These are the passed selected tick elements
 *
 * @param  {number} width
 * The threshold for splitting text.
 *
 */
export function wrapX(
	text: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>,
	width: number
) {
	text.each((d, i, n) => {
		let selection = d3.select(n[i]),
			words = selection.text().split(/\s+/).reverse(),
			word,
			line: string[] = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = selection.attr("y"),
			dy = parseFloat(selection.attr("dy")),
			tspan = selection
				.text(null)
				.append("tspan")
				.attr("x", 0)
				.attr("y", y)
		while ((word = words.pop())) {
			line.push(word)
			tspan.text(line.join(" "))
			//@ts-ignore
			if (tspan.node().getComputedTextLength() > width) {
				line.pop()
				tspan.text(line.join(" "))
				line = [word]
				tspan = selection
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word)
			}
		}
	})
}

const formatMillisecond = d3.timeFormat(".%L"),
	formatSecond = d3.timeFormat(":%S"),
	formatMinute = d3.timeFormat("%I:%M"),
	formatHour = d3.timeFormat("%H:%M"),
	formatDay = d3.timeFormat("%a %d"),
	formatWeek = d3.timeFormat("%b %d"),
	formatMonth = d3.timeFormat("%b"),
	formatYear = d3.timeFormat("%Y")
/**
 * Return custom date format
 * @param  {Date} date
 */
export function multiFormat(date: Date) {
	return (d3.timeSecond(date) < date
		? formatMillisecond
		: d3.timeMinute(date) < date
		? formatSecond
		: d3.timeHour(date) < date
		? formatMinute
		: d3.timeDay(date) < date
		? formatHour
		: d3.timeMonth(date) < date
		? d3.timeWeek(date) < date
			? formatDay
			: formatWeek
		: d3.timeYear(date) < date
		? formatMonth
		: formatYear)(date)
}
