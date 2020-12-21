import React, { useEffect, useState } from "react"
// import { getRawData } from 'actions'
import LineGraph from "components/D3Panels/LineGraph"
import scroller from "pages/dashboard/scroller"
import "./style.css"
import HorzBarGraph from "components/D3Panels/HorzBarGraph"
import ColorSection from "components/D3Panels/ColorSection"
import Header from "components/Header/Header"
import Loading from "components/Header/Loading"
import { RouteComponentProps } from "react-router"

type P = {} & RouteComponentProps
const raw_data: any = {}

const getHeaderHeight = () => {
	const isMobile = window.matchMedia("(max-width: 767px)").matches

	const header_classname = isMobile ? "logo-header-logo" : "header"
	const header_element = document.getElementsByClassName(header_classname)
	return header_element.length > 0 ? header_element[0].clientHeight : 0
}

const Dashboard: React.FunctionComponent<P> = (props) => {
	const [height, setHeight] = useState(window.innerHeight)
	const [width, setWidth] = useState(window.innerWidth)
	const [y, setY] = useState(250)
	const [visibleInd, setVisibleInd] = useState(-1)
	/*The Index of cardInd specifies the section, and the value specifies the card number
	 active for that section.*/
	const [cardIndex, setCardIndex]: [number[], Function] = useState([])

	useEffect(() => {
		window.onscroll = () => setY(window.pageYOffset)

		window.onresize = () => {
			setWidth(window.innerWidth)
			if (window.matchMedia("(max-width: 767px)").matches) {
				/*compare new height to old height only update when
				height increase by more than 5% or decreases by more
				than 30%.*/
				if (
					(window.innerHeight - height) / height > 0.05 ||
					(height - window.innerHeight) / height > 0.1
				) {
					setHeight(window.innerHeight)
				}
			} else {
				setHeight(window.innerHeight)
			}
		}
	})

	useEffect(() => {
		const d3_main = document.getElementsByClassName("d3-main")[0]
		const index: number = scroller(
			d3_main,
			d3_main.getElementsByClassName("section")
		)
		setVisibleInd(index)

		const graphic_el = document.getElementsByClassName("graphic")
		const len = graphic_el.length
		for (let i = 0; i < len; i++) {
			const temp = cardIndex
			temp[i] = scroller(
				graphic_el[i],
				graphic_el[i].getElementsByClassName("card")
			)
			setCardIndex(temp)
		}
	})

	const header_height = getHeaderHeight()
	const container_height = height - header_height
	let container_width = 0.75 * width

	if (window.matchMedia("(max-width: 767px)").matches) {
		container_width = 0.95 * width
	}

	const section_components = [LineGraph, ColorSection, HorzBarGraph]

	return (
		<div className="main">
			<Header VisibleInd={visibleInd} />

			<div className="d3-main">
				<Loading loading={false} />
				<div
					className="GraphsDiv"
					style={{ width: "100%", display: "block" }}>
					{section_components.map((S, i) => (
						<S
							key={i}
							height={container_height}
							width={container_width}
							data={raw_data}
							cardInd={cardIndex[i]}
							isVisible={visibleInd === i}
							headHeight={header_height}
						/>
					))}
				</div>

				<div className="footer">
					<a href="https://labs.cerp.org.pk">
						<img src="https://labs.cerp.org.pk/public/labs-grey-oswald.png" />
					</a>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
