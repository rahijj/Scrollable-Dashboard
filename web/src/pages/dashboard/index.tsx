import React, { useEffect, useState } from "react"
// import { getRawData } from 'actions'
import LineGraphNew from "components/D3Panels/LineGraphNew"
import scroller from "pages/dashboard/scroller"
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
	let cardIndex: number[] = []

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
					(height - window.innerHeight) / height > 0.2
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
	})

	cardIndex = Array.from(
		document.getElementsByClassName("graphic")
	).map((el) => scroller(el, el.getElementsByClassName("card")))

	const header_height = getHeaderHeight()
	const container_height = height - header_height
	let container_width = 0.75 * width

	if (window.matchMedia("(max-width: 767px)").matches) {
		container_width = 0.95 * width
	}

	const section_components = [LineGraphNew, ColorSection, HorzBarGraph]

	return (
		<div className="main bg-gray-50 w-full flex flex-col">
			<Header VisibleInd={visibleInd} />

			<div className="d3-main bg-gray-50 w-full flex flex-col">
				<Loading loading={false} />
				<div className="w-full block">
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

				<div className="footer h-12 items-center flex ml-auto mt-3">
					<a href="https://labs.cerp.org.pk">
						<img
							className="h-12 w-auto p-3"
							src="https://labs.cerp.org.pk/public/labs-grey-oswald.png"
						/>
					</a>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
