import * as d3 from "d3"
import * as helper from "./helperFunctions"

interface CHB {
	svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
	data_obj: DataObjType[]
	width: number
	height: number
	x_scale:
		| d3.ScaleLinear<number, number, never>
		| d3.ScaleTime<number, number, never>
		| any
	// | d3.ScaleBand<string>
	y_scale:
		| d3.ScaleLinear<number, number, never>
		| d3.ScaleTime<number, number, never>
		| any
	// | d3.ScaleBand<string>

	legend?: Record<string, string>
	xLabel?: string
	yLabel?: string
	plotTitle?: string
	LineColor?: string[]
	margin?: { top: number; right: number; bottom: number; left: number }
}
export function create_horz_bar({
	svg,
	data_obj,
	x_scale,
	y_scale,
	xLabel = "X Label",
	yLabel = "Y Label",
	plotTitle = "Plot Title",
	margin = { top: 60, right: 20, bottom: 60, left: 45 },
	width,
	height,
}: CHB) {
	const xAxis = d3.axisBottom(x_scale)
	const yAxis = d3.axisLeft(y_scale)
	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom

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

	helper.generateHorzBars({
		selection: svg,
		data: data_obj,
		x_scale: x_scale,
		y_scale: y_scale,
	})

	helper.highlightHorzBar({
		selection: svg,
		y_scale: y_scale,
		x_scale: x_scale,
		margin: margin,
	})
	helper.plotTitle({ selection: svg, innerWidth, title: plotTitle })

	svg.attr("transform", `translate(${margin.left},${margin.top})`)
}
