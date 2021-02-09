import React, { useEffect, useState } from "react"
import * as d3 from "d3"
import { create_horz_bar } from "./CreateHorzBar"

const HorzBarGraph: React.FC<SectionProps> = ({
	width,
	height,
	data,
	cardInd,
	isVisible,
	headHeight,
}) => {
	function HorzBar(index: number) {
		const margin = { top: 60, right: 20, bottom: 60, left: 60 }

		const innerWidth = width - margin.left - margin.right
		const innerHeight = height - margin.top - margin.bottom
		const svg = d3.select(".HorzBarSVG")

		let plotTitle = ""
		plotTitle = "Scroll 1"
		if (index == 1) {
			plotTitle = "Scroll 2"
		}

		const data_obj: DataObjType[] = [
			{
				X: 100 / (index + 1),
				Y: "Tick1",
			},
			{
				X: 90 / (index + 1),
				Y: "Tick2",
			},
			{
				X: 80 / (index + 1),
				Y: "Tick3",
			},
		]

		const x_scale = d3.scaleLinear().domain([0, 105]).range([0, innerWidth])

		const y_scale = d3
			.scaleBand()
			.domain(data_obj.map((e) => String(e.Y)))
			.range([0, innerHeight])

		y_scale.padding(0.2)
		const xLabel = "x Label"
		const yLabel = "y Label"

		create_horz_bar({
			data_obj: data_obj,
			width: width,
			height: height,
			x_scale: x_scale,
			y_scale: y_scale,
			xLabel: xLabel,
			yLabel: yLabel,
			plotTitle: plotTitle,
			svg: svg,
			margin: margin,
		})
	}

	const section = d3.select("#HorzBarGraph")

	useEffect(() => {
		if (isVisible) {
			section.selectAll(".card").style("opacity", function (d, i) {
				return i === cardInd ? 1 : 0.3
			})
			d3.select(".HorzBarSVG").style("opacity", 1)
			HorzBar(cardInd)
		} else {
			section.selectAll(".card").style("opacity", 0.4)

			d3.select(".HorzBarSVG").style("opacity", 0.4)
		}
	}, [isVisible, cardInd, width, height, data, headHeight])

	return (
		<div
			id="HorzBarGraph"
			className="section"
			style={{
				width: `${width}`,
				height: `${(height + headHeight) * 3}px`,
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
			</div>
			<div className="vis" style={{ height: height, top: headHeight }}>
				<svg
					className={
						"border border-black transition duration-300 flex overflow-visible"
					}
					width={width}
					height={height}>
					<g className="HorzBarSVG" />
				</svg>
			</div>
		</div>
	)
}

export default HorzBarGraph
