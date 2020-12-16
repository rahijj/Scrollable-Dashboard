import React from "react"

const ColorSection: React.FC<SectionProps> = ({
	width,
	height,
	cardInd,
	isVisible,
	section,
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
			<div id="graphic" className={section}>
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
				id="vis"
				style={{
					height: height,
					backgroundColor: colors[cardInd],
					transition: "all .3s ease-in",
				}}
			/>
		</div>
	)
}

export default ColorSection
