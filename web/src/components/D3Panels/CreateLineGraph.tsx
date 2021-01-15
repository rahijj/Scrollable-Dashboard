import * as d3 from "d3"
import * as helper from "./helperFunctions"

interface CLG {
	svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	data_obj: DataObjType[][]
	width: number
	height: number
	x_scale:
		| d3.ScaleLinear<number, number, never>
		| d3.ScaleTime<number, number, never>
	y_scale:
		| d3.ScaleLinear<number, number, never>
		| d3.ScaleTime<number, number, never>
	legend?: Record<string, string>
	xLabel?: string
	yLabel?: string
	plotTitle?: string
	LineColor?: string[]
	margin?: { top: number; right: number; bottom: number; left: number }
}
export function create_line_graph({
	svg,
	data_obj,
	x_scale,
	y_scale,
	legend = { Legend: "orange" },
	xLabel = "X Label",
	yLabel = "Y Label",
	plotTitle = "Plot Title",
	LineColor = ["orange"],
	margin = { top: 60, right: 20, bottom: 60, left: 45 },
	width,
	height,
}: CLG) {
	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom
	helper.createGrid(svg, innerHeight)
	helper.createAxis(svg, innerHeight)
	/* Initialise elements in this order to avoid overlaps */
	helper.generateElements([["legend", 1]], "legend", svg, "g")
	helper.generateElements([["links", 1]], "links", svg, "g")
	helper.generateElements([["nodes", 1]], "nodes", svg, "g")

	const gNodes = svg.select(".nodes")
	const gLinks = svg.select(".links")

	/* This allows longer plot titles to split into two lines for the mobile version */
	if (window.matchMedia("(max-width: 767px)").matches) {
		helper.plotTitle(svg, innerWidth, plotTitle, true)
	} else {
		helper.plotTitle(svg, innerWidth, plotTitle)
	}

	const passedList = Object.values(data_obj)

	/* *************************SET AXIS AND GRID******************************************** */

	const xAxis = d3.axisBottom(x_scale)
	// .tickValues([
	// 	new Date(2020, 0, 1),
	// 	new Date(2020, 1, 1),
	// 	new Date(2020, 4, 1),
	// 	new Date(2020, 7, 1),
	// 	new Date(2020, 9, 1),
	// 	new Date(2020, 11, 1),
	// ])
	// //@ts-ignore
	// .tickFormat(d3.timeFormat("%b"))

	const tick = ""

	helper.showXAxis(xAxis, svg, innerHeight, innerWidth, xLabel)
	//@ts-ignore
	helper.showXGrid(xAxis.tickSize(-innerHeight).tickFormat(tick), svg)

	const yAxis = d3.axisLeft(y_scale)
	helper.showYAxis(yAxis, svg, innerHeight, innerWidth, yLabel, margin)
	//@ts-ignore
	helper.showYGrid(yAxis.tickSize(-innerWidth).tickFormat(tick), svg)

	svg.select(".yGrid")
		.selectAll("g.tick")
		.filter((d) => d == 0)
		.select("line")
		.style("stroke-width", 2)
		.style("stroke", "red")

	helper.showLegend(legend, svg)
	svg.selectAll(".legend").attr(
		"transform",
		`translate(${x_scale(x_scale.domain()[1]) / 1.1},${
			y_scale(y_scale.domain()[0]) / 10
		})`
	)

	/* ********************************************CREATE LINE*********************************** */
	const line = d3
		.line<DataObjType>()
		.x((d) => {
			return x_scale(d.X)
		})
		.y((d) => y_scale(d.Y))

	const line_class_name = "LineNorm"
	const strokeWidth = "3"
	const t = gLinks.transition().delay(750).duration(500)
	gLinks
		.selectAll("." + line_class_name)
		.data(passedList)
		.join(
			(enter) =>
				enter
					.append("path")
					.attr("id", line_class_name)
					.attr("class", line_class_name)
					.attr("fill", "none")
					.style("stroke", (d, i) => {
						if (i > LineColor.length - 1) {
							return "orange"
						}
						return LineColor[i]
					})
					.style("stroke-width", "0")
					.call((s) =>
						s
							.transition(t)
							.style("stroke-width", strokeWidth)
							.attr("d", line)
					),
			(update) =>
				update.call((s) =>
					s
						.transition(t)
						.style("stroke-width", strokeWidth)
						.attr("d", line)
						.style("stroke", (d, i) => {
							if (i > LineColor.length - 1) {
								return "orange"
							}
							return LineColor[i]
						})
				),
			(exit) =>
				exit
					.transition()
					.duration(500)
					.style("stroke-width", "0")
					.remove()
		)

	/* ****************************************** CREATE DATA POINT CIRCLES********************************/
	const combinedList: DataObjType[] = []
	passedList.forEach((e) =>
		//@ts-ignore
		e.forEach((i) => combinedList.push(i))
	)

	const point_class = "Point"
	const tooltipClass = "tooltip"
	const t2 = gNodes.transition().duration(1100)

	gNodes
		.selectAll("." + point_class)
		.data(combinedList)
		.join(
			(enter) =>
				enter
					.append("circle")
					.attr(
						"class",
						point_class +
							" fill-current text-gray-500 hover:text-yellow-500"
					)
					.attr("opacity", 1)
					.attr("cx", (d) => x_scale(d.X))
					.attr("cy", (d) => y_scale(d.Y))
					.attr("r", 5),
			(update) =>
				update.call((s) =>
					s
						.transition(t2)
						.attr("cx", (d) => x_scale(d.X))
						.attr("cy", (d) => y_scale(d.Y))
						.attr("opacity", 1)
						.attr("r", 5)
				),
			(exit) => exit.transition().duration(200).attr("r", 0).remove()
		)

	/* ***********************CREATE TOOLTIP TO SHOW ON MOUSEOVER ON DATA POINTS************************ */
	helper.generateTooltip(
		[["tooltip", 1]],
		tooltipClass,
		d3.selectAll(".vis"),
		"div"
	)

	const tooltip = d3.selectAll("." + tooltipClass).style("display", "none")
	helper.generateElements([["table", 1]], "table", tooltip, "table")

	const table = tooltip.selectAll(".table")
	//@ts-ignore
	helper.generateElements([["tbody", 1]], "tbody", table, "tbody")
	const tableBody = table.selectAll(".tbody")

	gNodes
		.selectAll("." + point_class)
		.on(
			"mouseover",
			//@ts-ignore
			function (this, event, d: DataObjType) {
				d3.select(this).attr("r", 12)
				const rowList = Object.entries(d)
				//@ts-ignore
				helper.generateElements(rowList, "tr", tableBody, "tr")
				const rows = d3.selectAll(".tr")
				rows.selectAll("td")
					.data((d: any) => d)
					.join(
						(enter) =>
							enter
								.append("td")
								.attr("class", "td")
								.style("color", "white")
								.text((d: any) => d),
						(update) => update.text((d: any) => d),
						(exit) => exit.remove()
					)
				tooltip
					.style("left", () => x_scale(d.X) - 20 + "px")
					.style("top", y_scale(d.Y) + 85 + "px")
					.style("display", "block")
			}
		)
		.on("mouseout", function (this) {
			tooltip.style("display", "none")
			d3.select(this).attr("r", 5)
		})

	svg.attr("transform", `translate(${margin.left},${margin.top})`)
}
