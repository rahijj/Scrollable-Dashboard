import React, { useEffect } from "react"
import * as d3 from "d3"
import { create_line_graph } from "./CreateLineGraph"

const LineGraph: React.FC<SectionProps> = ({
	width,
	height,
	data,
	cardInd,
	isVisible,
	headHeight,
}) => {
	function Line(index: number) {
		// These are margins set to make space for Plot Labels.
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

		//Passed data object is a List of List of Objects. Each List is data for one Line.

		const data_obj: DataObjType[][] = [
			[
				{
					X: new Date(2020, 1),
					Y: 0 * ((index + 1) / 3),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 4),
					Y: -25 * ((index + 1) / 3),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 6),
					Y: 0,
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 9),
					Y: -30 * ((index + 1) / 3),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
			],
			[
				{
					X: new Date(2020, 1),
					Y: 0 * ((index + 1) / 4),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 4),
					Y: -25 * ((index + 1) / 4),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 6),
					Y: 0,
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
				{
					X: new Date(2020, 9),
					Y: -30 * ((index + 1) / 4),
					Mean: -1,
					"25 %": -1,
					"50 %": -1,
					"75 %": -1,
					Count: -1,
				},
			],
		]
		const legend = {
			"line 1": "red",
			"line 2": navy,
		}
		const innerWidth = width - margin.left - margin.right
		const innerHeight = height - margin.top - margin.bottom
		const svg = d3.select(".LineSVG")
		const linearScale = d3
			.scaleLinear()
			.domain([-45, 15])
			.range([innerHeight, 0])
		const bandScale = d3
			.scaleTime()
			.domain([new Date(2020, 0), new Date(2020, 11)])
			.range([0, innerWidth])

		create_line_graph({
			data_obj: data_obj,
			width: width,
			height: height,
			x_scale: bandScale,
			y_scale: linearScale,
			legend: legend,
			xLabel: xLabel,
			yLabel: yLabel,
			plotTitle: plotTitle,
			LineColor: ["red", navy], // The color of the line corresponds to the index of that line i the passed data_obj
			svg: svg,
			margin: margin,
		})
	}

	const section = d3.select("#LineGraph")

	useEffect(() => {
		if (isVisible) {
			section
				.selectAll(".card")
				.style("opacity", (d, i) => (i === cardInd ? 1 : 0.3))
			d3.select(".LineSVG").style("opacity", 1)
			Line(cardInd)
		} else {
			section.selectAll(".card").style("opacity", 0.4)

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
					{/* This group element is required so that the graph area can be translated within the svg */}
					<g className="LineSVG" />
				</svg>
			</div>
		</div>
	)
}

export default LineGraph
