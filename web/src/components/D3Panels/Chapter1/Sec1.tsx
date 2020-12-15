import React, { useEffect, useState } from "react"
import * as d3 from "d3"

interface P {
	width: number
	height: number
	cardInd: number
	isVisible: boolean
	section: string
	headHeight: number
}

const HorzBarGraph: React.FC<P> = ({
	width,
	height,
	cardInd,
	isVisible,
	section,
	headHeight,
}) => {
	const [graphicFilter, set_graphic] = useState(999)

	const grey = "grey"
	const navy = "#344a62"
	const orange = "orange"
	const Colors: string[] = [grey, navy, orange]

	const pan = d3.select("." + section)

	useEffect(() => {
		if (isVisible) {
			pan.selectAll(".card").style("opacity", function (d, i) {
				return i === cardInd ? 1 : 0.3
			})

			d3.select("#SecTemp1SVG").style("opacity", 1)
		} else {
			pan.selectAll(".card").style("opacity", 0.4)

			d3.select("#SecTemp1SVG").style("opacity", 0.4)
		}
		set_graphic(999)
	}, [isVisible, cardInd, width, height, headHeight])

	return (
		<div
			id="SecTemp1"
			className="section"
			style={{
				width: `${width}`,
				height: `${(height + headHeight) * 4}px`,
			}}>
			<div
				id="graphic"
				className={section}
				style={{ zIndex: graphicFilter }}>
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
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis facilisis suscipit dui accumsan mattis.
					</div>
				</div>
			</div>
			<div id="vis" style={{ height: height }}>
				<svg
					id="SecTemp1SVG"
					width={width}
					height={height}
					style={{ backgroundColor: Colors[cardInd] }}></svg>
			</div>
		</div>
	)
}

export default HorzBarGraph
