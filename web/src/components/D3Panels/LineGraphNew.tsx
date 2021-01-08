import React, { useEffect } from "react"
import * as d3 from "d3"
import * as helper from "./helperFunctions"
import { max, min } from "d3"

const LineGraph: React.FC<SectionProps> = ({
	width,
	height,
	data,
	cardInd,
	isVisible,
	headHeight,
}) => {
	function Line(index: number) {
		// These are margins are set to make space for Plot Labels.
		const margin = { top: 60, right: 20, bottom: 60, left: 45 }

		const yLabel = "yLabel"
		const xLabel = "xLabel"
		let plotTitle = ""
		const navy = "#344a62"

		plotTitle = "Scroll 1"
		if (index === 1) {
			plotTitle = "Scroll 2"
		} else if (index == 2) {
			plotTitle = "Scroll 3"
		}

		//Format for input data object is "{Month (x axis value) : {Value : Y axis value, ...... and other
		//KEY VALUE pairs that need to be shown in the tooltip on hover }}
		const data_obj = {
			1: {
				Value: 0 * ((index + 1) / 3),
				Mean: -1,
				"25 %": -1,
				"50 %": -1,
				"75 %": -1,
				Count: -1,
			},
			4: {
				Value: -25 * ((index + 1) / 3),
				Mean: -1,
				"25 %": -1,
				"50 %": -1,
				"75 %": -1,
				Count: -1,
			},
			6: {
				Value: 0,
				Mean: -1,
				"25 %": -1,
				"50 %": -1,
				"75 %": -1,
				Count: -1,
			},
			9: {
				Value: -30 * ((index + 1) / 3),
				Mean: -1,
				"25 %": -1,
				"50 %": -1,
				"75 %": -1,
				Count: -1,
			},
		}

		const svg = d3.select(".LineSVG")

		create_line_graph({
			data_obj: data_obj,
			width: width,
			height: height,
			xLabel: xLabel,
			yLabel: yLabel,
			plotTitle: plotTitle,
			LineColor: navy,
			svg: svg,
			margin: margin,
		})
	}

	interface CLG {
		svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
		data_obj: Record<string, Record<string, number>>
		width: number
		height: number
		xLabel?: string
		yLabel?: string
		plotTitle?: string
		LineColor?: string
		margin?: { top: number; right: number; bottom: number; left: number }
	}
	function create_line_graph({
		svg,
		data_obj,
		xLabel = "X Label",
		yLabel = "Y Label",
		plotTitle = "Plot Title",
		LineColor = "orange",
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

		let legend: Record<string, string> = {}
		const passedList: [string, Record<string, number>][][] = []

		/* This allows lonnger plot titles to split into two lines for the mobile version */
		if (window.matchMedia("(max-width: 767px)").matches) {
			helper.plotTitle(svg, innerWidth, plotTitle, true)
		} else {
			helper.plotTitle(svg, innerWidth, plotTitle)
		}

		const passedData = Object.entries(data_obj)
		passedList.push(passedData)

		/* *************************SET AXIS AND GRID******************************************** */
		const linearScale = d3
			.scaleLinear()
			.domain([
				Math.min(
					-45,
					1.3 * Number(min(passedData.map((e) => e[1].Value)))
				),
				Math.max(
					15,
					1.3 * Number(max(passedData.map((e) => e[1].Value)))
				),
			])
			.range([innerHeight, 0])
		const bandScale = d3
			.scaleTime()
			.domain([new Date(2020, 0, 1), new Date(2020, 10, 31)])
			.range([0, innerWidth])

		const xAxis = d3
			.axisBottom(bandScale)
			.tickValues([
				new Date(2020, 0, 1),
				new Date(2020, 1, 1),
				new Date(2020, 4, 1),
				new Date(2020, 7, 1),
				new Date(2020, 9, 1),
				new Date(2020, 11, 1),
			])
			//@ts-ignore
			.tickFormat(d3.timeFormat("%b"))

		const tick = ""

		helper.showXAxis(xAxis, svg, innerHeight, innerWidth, xLabel)
		//@ts-ignore
		helper.showXGrid(xAxis.tickSize(-innerHeight).tickFormat(tick), svg)

		const yAxis = d3.axisLeft(linearScale)
		helper.showYAxis(yAxis, svg, innerHeight, innerWidth, yLabel, margin)
		//@ts-ignore
		helper.showYGrid(yAxis.tickSize(-innerWidth).tickFormat(tick), svg)

		svg.select(".yGrid")
			.selectAll("g.tick")
			.filter((d) => d == 0)
			.select("line")
			.style("stroke-width", 2)
			.style("stroke", "red")

		legend = {
			Legend: LineColor,
		}
		helper.showLegend(legend, svg)
		svg.selectAll(".legend").attr(
			"transform",
			`translate(${bandScale(new Date(2020, 11, 1)) - 80},${linearScale(
				linearScale.domain()[0] + 13
			)})`
		)

		/* ********************************************CREATE LINE*********************************** */
		const line: any = d3
			.line()
			.x((d) => {
				return bandScale(new Date(2020, d[0], 1))
			})
			//@ts-ignore
			.y((d) => linearScale(d[1].Value))

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
						.style("stroke", LineColor)
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
					),
				(exit) =>
					exit
						.transition()
						.duration(500)
						.style("stroke-width", "0")
						.remove()
			)

		/* ****************************************** CREATE DATA POINT CIRCLES********************************/
		const combinedList: [string, Record<string, number>][] = []
		passedList.forEach((e) =>
			//@ts-ignore
			e.forEach((i) => combinedList.push([i[0], i[1]]))
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
						.attr("cx", (d) =>
							bandScale(new Date(2020, Number(d[0]), 1))
						)
						.attr("cy", (d) => linearScale(d[1].Value))
						.attr("r", 5),
				(update) =>
					update.call((s) =>
						s
							.transition(t2)
							.attr("cx", (d) =>
								bandScale(new Date(2020, Number(d[0]), 1))
							)
							.attr("cy", (d) => linearScale(d[1].Value))
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

		const tooltip = d3
			.selectAll("." + tooltipClass)
			.style("display", "none")
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
				function (this, event, d: [string, Record<string, number>]) {
					d3.select(this).attr("r", 12)
					const rowList = Object.entries(d[1])
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
						.style(
							"left",
							() =>
								bandScale(new Date(2020, Number(d[0]), 1)) -
								20 +
								"px"
						)
						.style("top", linearScale(d[1].Value) + 85 + "px")
						.style("display", "block")
				}
			)
			.on("mouseout", function (this) {
				tooltip.style("display", "none")
				d3.select(this).attr("r", 5)
			})

		svg.attr("transform", `translate(${margin.left},${margin.top})`)
	}

	const scrollVis = (index: number) => {
		Line(index)
	}

	const pan = d3.select("#LineGraph")

	useEffect(() => {
		if (isVisible) {
			pan.selectAll(".card").style("opacity", (d, i) =>
				i === cardInd ? 1 : 0.3
			)
			d3.select(".LineSVG").style("opacity", 1)
			scrollVis(cardInd)
		} else {
			pan.selectAll(".card").style("opacity", 0.4)

			d3.select(".LineSVG").style("opacity", 0.4)
		}
	}, [isVisible, cardInd, data, width, height, headHeight])

	return (
		<div
			id="LineGraph"
			className="section"
			style={{
				width: `${width}`,
				height: `${(height + headHeight) * 4}px`,
			}}>
			<div className={"graphic"}>
				<div className="card">
					<div className="card-content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
				<div className="card">
					<div className="card-content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
				<div className="card">
					<div className="card-content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
			</div>
			<div className="vis" style={{ height: height, top: headHeight }}>
				<svg
					className={
						"border border-black transition duration-300 flex overflow-visible"
					}
					width={width}
					height={height}>
					<g className="LineSVG" />
				</svg>
			</div>
		</div>
	)
}

export default LineGraph
