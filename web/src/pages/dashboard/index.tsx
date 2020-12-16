import React, { useEffect, useState } from "react"
import * as d3 from "d3"
// import { getRawData } from 'actions'
import LineGraph from "components/D3Panels/Chapter1/LineGraph"
import scroller from "pages/dashboard/scroller"
import "./style.css"
import HorzBarGraph from "components/D3Panels/Chapter1/HorzBarGraph"
import Sec1 from "components/D3Panels/Chapter1/Sec1"
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
	// This Height and width paramerters passed to the components is the
	// height and width we want our svg graph to be.

	// The -180 here is the height of the header
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
			setHeight(window.innerHeight)

			/*
			if (window.matchMedia("(max-width: 767px)").matches) {
				// compare new height to old height
				// only update at 20% change
				setWidth(window.innerWidth * 0.95)
				set_openNav("0vh")
				set_NavBName("Navigation")
				if (
					(window.innerHeight - (height + headHeight)) /
						(height + headHeight) >
					0.05
				) {
					setHeight(window.innerHeight - headHeight)
				} else if (
					(height + headHeight - window.innerHeight) /
						(height + headHeight) >
					0.3
				) {
					setHeight(window.innerHeight - headHeight)
				}
			} else {
				set_openNav("94px")
				// The viewport is at least 768 pixels wide
				setWidth(window.innerWidth * 0.75)

				setHeight(window.innerHeight - headHeight)
			}
			*/
		}
	})

	useEffect(() => {
		const pan = d3.select(".d3-main")
		const index: number = scroller(pan, pan.selectAll(".section"), y)
		setVisibleInd(index)

		let n = 0
		Object.keys(SectionInd).forEach((sec) => {
			const pan = d3.select("." + sec)
			const temp = cardIndex
			temp[n] = scroller(pan, pan.selectAll(".card"), y)
			setCardIndex(temp)
			n += 1
		})
	})

	//SectionInd MUST be in same Order as Order of Sections in d3-main div below
	const SectionInd: Record<string, number> = {
		Sec_0: 0,
		Sec_1: 0,
		Sec_2: 0,
	}

	let n = 0
	Object.keys(SectionInd).forEach((e) => {
		SectionInd[e] = n
		n += 1
	})

	const header_height = getHeaderHeight()
	const container_height = height - header_height
	const container_width = 0.75 * width

	const section_components = [Sec1, LineGraph, HorzBarGraph]

	return (
		<div className="main">
			<Header VisibleInd={visibleInd} SectionInd={SectionInd} />

			<div className="d3-main">
				<Loading loading={false} />
				<div
					className="GraphsDiv"
					style={{ width: "100%", display: "block" }}>
					{/*
							section_components.map((S, i) => <S key={i} width={container_width} height/>)
						*/}
					<Sec1
						width={container_width}
						height={container_height}
						cardInd={cardIndex[SectionInd["Sec_0"]]}
						isVisible={visibleInd === SectionInd["Sec_0"]}
						section={"Sec_0"}
						headHeight={header_height}
					/>
					<LineGraph
						width={container_width}
						height={container_height}
						data={raw_data}
						cardInd={cardIndex[SectionInd["Sec_1"]]}
						isVisible={visibleInd === SectionInd["Sec_1"]}
						section={"Sec_1"}
						headHeight={header_height}
					/>
					<HorzBarGraph
						width={container_width}
						height={container_height}
						data={raw_data}
						cardInd={cardIndex[SectionInd["Sec_2"]]}
						isVisible={visibleInd === SectionInd["Sec_2"]}
						section={"Sec_2"}
						headHeight={header_height}
					/>
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
