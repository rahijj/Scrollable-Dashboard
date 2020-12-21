/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react"
import * as d3 from "d3"
import { max } from "d3"
import * as helper from "./helperFunctions"

const HorzBarGraph: React.FC<SectionProps> = ({
	width,
	height,
	data,
	cardInd,
	isVisible,
	headHeight,
}) => {
	const margin = { top: 60, right: 20, bottom: 60, left: 60 }
	const [graphicFilter, set_graphic] = useState(999)

	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom

	function HorzBar(index: number) {
		const order_by_ordering = (
			[, k1]: [any, number],
			[, k2]: [any, number]
		) => k2 - k1
		const g = d3.select(".HorzBarSVG")
		const t = g.transition().duration(650)

		const data_obj: Record<string, number> = {
			"Tick 1": 100 / (index + 1),
			"Tick 2": 90 / (index + 1),
			"Tick 3": 80 / (index + 1),
			"Tick 4": 70 / (index + 1),
			"Tick 5": 60 / (index + 1),
			"Tick 6": 50 / (index + 1),
			"Tick 7": 40 / (index + 1),
			"Tick 8": 30 / (index + 1),
			"Tick 9": 20 / (index + 1),
			"Tick 10": 14 / (index + 1),
			"Tick 11": 9 / (index + 1),
		}
		const tooltipTable: Record<string, Record<string, string>> = {}
		Object.keys(data_obj).forEach((e) => {
			tooltipTable[e] = {
				Value: data_obj[e].toFixed(2) + "%",
			}
		})

		const [linearScale, bandScale] = helper.generateAxis(
			Object.entries(data_obj)
				.sort(order_by_ordering)
				.map(([a, b]) => a),
			[0, Math.max(75, Number(max(Object.values(data_obj))))],
			[0, innerHeight],
			[0, innerWidth]
		)

		bandScale.padding(0.2)

		const xAxis = d3.axisBottom(linearScale)
		const yAxis = d3.axisLeft(bandScale)

		let passedData

		let plotTitle = ""
		plotTitle = "Scroll 1"
		if (index == 1) {
			plotTitle = "Scroll 2"
		}
		passedData = Object.entries(data_obj).sort(order_by_ordering)
		helper.generateElements(passedData, "BarGraph", g)
		g.selectAll(".BarGraph")
			.attr("height", bandScale.bandwidth())
			.attr("y", (d: any) => bandScale(d[0]))
			.call((s) =>
				s
					.transition(t)
					.attr("width", (d: any) => Math.max(0, linearScale(d[1])))
					.attr("x", 0)
					.delay((d, i) => i * 50)
			)

		helper.highlightBar({
			selection: g,
			bandScale: bandScale,
			linearScale: linearScale,
			className: "BarGraph",
			margin: margin,
			tooltipTable: tooltipTable,
		})
		g.attr("transform", `translate(${margin.left},${margin.top})`)

		const xLabel = "x Label"
		const yLabel = "y Label"

		if (window.matchMedia("(max-width: 767px)").matches) {
			helper.plotTitle(g, innerWidth, plotTitle, true)
		} else {
			helper.plotTitle(g, innerWidth, plotTitle, false)
		}

		helper.showXAxis(xAxis, g, innerHeight, innerWidth, xLabel)
		helper.showYAxis(yAxis, g, innerHeight, innerWidth, yLabel, margin)
	}

	const scrollVis = (index: number) => {
		const g = d3.select(".HorzBarSVG")

		helper.createAxis(g, innerHeight)

		HorzBar(index)
	}

	const pan = d3.select("#HorzBarGraph")

	useEffect(() => {
		if (isVisible) {
			pan.selectAll(".card").style("opacity", function (d, i) {
				return i === cardInd ? 1 : 0.3
			})

			d3.select(".HorzBarSVG").style("opacity", 1)
			scrollVis(cardInd)
		} else {
			pan.selectAll(".card").style("opacity", 0.4)

			d3.select(".HorzBarSVG").style("opacity", 0.4)
		}
		set_graphic(999)
	}, [isVisible, cardInd, width, height, data, headHeight])

	return (
		<div
			id="HorzBarGraph"
			className="section"
			style={{
				width: `${width}`,
				height: `${(height + headHeight) * 3}px`,
			}}>
			<div className={"graphic"} style={{ zIndex: graphicFilter }}>
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
			</div>
			<div className="vis" style={{ height: height }}>
				<svg width={width} height={height}>
					<g className="HorzBarSVG" />
				</svg>
			</div>
		</div>
	)
}

export default HorzBarGraph
