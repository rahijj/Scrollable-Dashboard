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
const Dashboard: React.FunctionComponent<P> = (props) => {
	const [openNav, set_openNav] = useState("94px")
	const [NavBName, set_NavBName] = useState("Navigation")
	// This Height and width paramerters passed to the components is the
	// height and width we want our svg graph to be.

	// The -180 here is the height of the header
	const [headHeight, setHeadHeight] = useState(0)
	const [height, setHeight] = useState(window.innerHeight - headHeight)
	const [width, setWidth] = useState(window.innerWidth * 0.75)
	const [y, setY] = useState(250)
	const [visibleInd, setVisibleInd] = useState(-1)
	const [orient, setOrient] = useState("0")
	const [cardInd, setCardInd] = useState([-1, -1, -1])

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
	useEffect(() => {
		setHeadHeight(document.getElementsByClassName("header")[0].clientHeight)

		if (window.matchMedia("(max-width: 767px)").matches) {
			set_openNav("0vh")
			setHeight(window.innerHeight - headHeight)
		}
		if (window.matchMedia("(orientation: landscape)").matches) {
			setOrient("90")
		}
	}, [])

	useEffect(() => {
		setHeight(window.innerHeight - headHeight)
	}, [headHeight])

	useEffect(() => {
		if (window.matchMedia("(max-width: 767px)").matches) {
			setHeadHeight(
				document.getElementsByClassName("logo-header-logo")[0]
					.clientHeight
			)
			setWidth(window.innerWidth * 0.95)
			if (window.matchMedia("(orientation: landscape)").matches) {
				if (orient != "90") {
					setHeight(window.innerHeight - headHeight)
					setOrient("90")
				}
			} else if (orient != "0") {
				setHeight(window.innerHeight - headHeight)
				setOrient("0")
			}
		} else {
			setHeadHeight(
				document.getElementsByClassName("header")[0].clientHeight
			)
		}
		window.onscroll = () => setY(window.pageYOffset)
		window.onresize = () => {
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
		}
	})

	useEffect(() => {
		const pan = d3.select(".d3-main")
		const index: number = scroller(pan, pan.selectAll(".section"), y)
		setVisibleInd(index)

		let n = 0
		Object.keys(SectionInd).forEach((sec) => {
			const pan = d3.select("." + sec)
			const temp = cardInd
			temp[n] = scroller(pan, pan.selectAll(".card"), y)
			setCardInd(temp)
			n += 1
		})
	})

	return (
		<div className="main">
			<Header
				VisibleInd={visibleInd}
				SectionInd={SectionInd}
				openNav={openNav}
				set_openNav={set_openNav}
				NavBName={NavBName}
				set_NavBName={set_NavBName}
			/>

			<div className="d3-main">
				<Loading loading={false} />
				<div
					className="GraphsDiv"
					style={{ width: "100%", display: "block" }}>
					<Sec1
						width={width}
						height={height}
						cardInd={cardInd[SectionInd["Sec_0"]]}
						isVisible={visibleInd === SectionInd["Sec_0"]}
						section={"Sec_0"}
						headHeight={headHeight}
					/>
					<LineGraph
						width={width}
						height={height}
						data={raw_data}
						cardInd={cardInd[SectionInd["Sec_1"]]}
						isVisible={visibleInd === SectionInd["Sec_1"]}
						section={"Sec_1"}
						headHeight={headHeight}
					/>
					<HorzBarGraph
						width={width}
						height={height}
						data={raw_data}
						cardInd={cardInd[SectionInd["Sec_2"]]}
						isVisible={visibleInd === SectionInd["Sec_2"]}
						section={"Sec_2"}
						headHeight={headHeight}
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
