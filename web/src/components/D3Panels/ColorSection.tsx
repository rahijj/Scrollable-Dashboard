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
					<div className="content">Grey</div>
				</div>
				<div className="card">
					<div className="content">Blue</div>
				</div>
				<div className="card">
					<div className="content">Orange</div>
				</div>
			</div>
			<div
				className="vis"
				style={{
					height: height,
					width: width,
					backgroundColor: colors[cardInd],
					transition: "all .3s ease-in",
				}}
			/>
		</div>
	)
}

export default ColorSection
