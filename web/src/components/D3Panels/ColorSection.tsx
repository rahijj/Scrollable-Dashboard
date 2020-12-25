import React from "react"

const ColorSection: React.FC<SectionProps> = ({
	width,
	height,
	cardInd,
	data,
	isVisible,
	headHeight,
}) => {
	const colors = ["grey", "#344a62", "orange"]

	return (
		<div
			id="ColorSection"
			className="section"
			style={{
				width: `${width}`,
				height: `${(height + headHeight) * 4}px`,
			}}>
			<div className={"graphic"}>
				<div className="card">
					<div className="card-content">Grey</div>
				</div>
				<div className="card">
					<div className="card-content">Blue</div>
				</div>
				<div className="card">
					<div className="card-content">Orange</div>
				</div>
			</div>
			<div
				className="vis"
				style={{
					height: height,
					top: headHeight,
				}}>
				<svg
					className={
						"border border-black transition duration-300 flex overflow-visible"
					}
					width={width}
					height={height}
					style={{
						backgroundColor: colors[cardInd],
					}}></svg>
			</div>
		</div>
	)
}

export default ColorSection
