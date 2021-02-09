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
	// | d3.ScaleBand<string>
	y_scale:
		| d3.ScaleLinear<number, number, never>
		| d3.ScaleTime<number, number, never>
	// | d3.ScaleBand<string>

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
	// .tickFormat(helper.multiFormat);

	const yAxis = d3.axisLeft(y_scale)

	helper.createAxis({
		selection: svg,
		xAxis: xAxis,
		yAxis: yAxis,
		innerHeight: innerHeight,
		innerWidth: innerWidth,
		xLabel: xLabel,
		yLabel: yLabel,
		leftMargin: margin.left,
	})

	helper.createGrid({
		selection: svg,
		xAxis: xAxis.tickSize(-innerHeight),
		yAxis: yAxis.tickSize(-innerWidth),
		innerHeight,
	})

	helper.plotTitle({ selection: svg, innerWidth, title: plotTitle })

	svg.select(".yGrid")
		.selectAll("g.tick")
		.filter((d) => d == 0)
		.select("line")
		.style("stroke-width", 2)
		.style("stroke", "red")

	helper.showLegend({ ItemsColours: legend, selection: svg })

	svg.selectAll(".legend").attr(
		"transform",
		`translate(${x_scale(x_scale.domain()[1]) / 1.1},${
			y_scale(y_scale.domain()[0]) / 10
		})`
	)

	helper.generateLineGraph({
		selection: svg,
		x_scale: x_scale,
		y_scale: y_scale,
		passedList: data_obj,
		Colors: LineColor,
	})

	const combinedList: DataObjType[] = []
	data_obj.forEach((e) => e.forEach((i) => combinedList.push(i)))

	helper.highlightLine({
		data: combinedList,
		selection: svg,
		x_scale: x_scale,
		y_scale: y_scale,
	})

	// Sort svg elements with 'ordered' className according to bound value.
	// This is done so the svg elements on the screen do not overlap incorrectly.
	svg.selectAll(".ordered").sort((a: any, b: any) => a - b)

	svg.attr("transform", `translate(${margin.left},${margin.top})`)
}
