import React, { useEffect, useState } from "react"
interface P {
	VisibleInd: number
}

// TODO: nav open/close should be entirely handled in header, not with props
const Header: React.FC<P> = ({ VisibleInd }) => {
	const burger =
		"transition-all duration-500 w-8 h-1 rounded bg-navy transform"
	const close_burger =
		"transition-all duration-500 w-7 h-1 rounded bg-navy absolute transform translate-y-4"

	const [openNav, set_openNav] = useState("0")
	const [burger1, set_burger1] = useState(burger + " translate-y-2.5")
	const [burger2, set_burger2] = useState(burger + " translate-y-4")
	const [isMobile, set_isMobile] = useState(false)

	useEffect(() => {
		set_isMobile(window.matchMedia("(max-width: 767px)").matches)
	})
	useEffect(() => {
		isMobile ? set_openNav("0") : set_openNav("28")
	}, [isMobile])

	return (
		<div className="header bg-white w-full top-0 z-50 sticky overflow-hidden md:mb-0 md:bg-gray-50">
			<div className="logo-header-logo w-full mx-auto px-4 py-5 flex flex-col max-w-screen-xl md:top-0">
				<div className="cerpHeader flex dlex-row items-center">
					<a
						className="navbar-brand w-full pl-24 inline-block mr-4 text-xl md:pl-0"
						href="https://www.cerp.org.pk/index.php">
						<img
							className="h-12 w-auto"
							src="cerp-logo.png"
							alt="Image Description"
						/>
					</a>
					<div className="header-buttons inline-flex flex-col text-sm w-full pl-24 md:pl-0 md:hidden">
						<ul className="header-list flex ml-auto overflow-hidden list-none">
							<li className="my-0 mr-2 ml-1 text-gray-500 cursor-pointer hover:text-blue-bright">
								<a href="https://pakistangrowthstory.org">
									Blog
								</a>
							</li>
							<li className="divider text-gray-500">|</li>
							<li className="my-0 mr-2 ml-1 text-gray-500 cursor-pointer hover:text-blue-bright">
								<a href="https://www.cerp.org.pk/pages/podcasts">
									Podcasts
								</a>
							</li>
							<li className="divider text-gray-500">|</li>
							<li className="my-0 mr-2 ml-1 text-gray-500 cursor-pointer hover:text-blue-bright">
								<a href="https://www.cerp.org.pk/pages/news">
									News
								</a>
							</li>
							<li className="divider text-gray-500">|</li>
							<li className="my-0 mr-2 ml-1 text-gray-500 cursor-pointer hover:text-blue-bright">
								<a href="https://www.cerp.org.pk/pages/events">
									Events
								</a>
							</li>
							<li className="divider text-gray-500">|</li>
							<li className="my-0 mr-2 ml-1 text-gray-500 cursor-pointer hover:text-blue-bright">
								<a href="https://www.cerp.org.pk/pages/careers">
									Careers
								</a>
							</li>
							<li className="divider text-gray-500">|</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="topnav-container bg-navy">
				<div
					className={
						"topnav md:h-" +
						String(openNav) +
						" h-28 transition-all duration-500 md:w-full md:block max-w-screen-lg m-auto w-full flex overflow-visible md:overflow-auto justify-center items-center bg-navy"
					}>
					<a
						className={
							(VisibleInd === 0
								? "text-blue-bright"
								: "text-white opacity-80") +
							" transition-all duration-500 ease-in-out w-full h-full md:h-auto md:py-3 md:px-1.5 flex flex-col text-base no-underline uppercase justify-center text-center hover:text-blue-bright"
						}
						href="#LineGraph">
						Line Template
					</a>
					<a
						className={
							(VisibleInd === 2
								? "text-blue-bright"
								: "text-white opacity-80") +
							" transition-all duration-500 ease-in-out w-full h-full md:h-auto md:py-3 md:px-1.5 flex flex-col text-base no-underline uppercase justify-center text-center hover:text-blue-bright"
						}
						href="#HorzBarGraph">
						Horz Bar Template
					</a>
				</div>
			</div>
			<div
				className="Nav_Button transition-all duration-500 absolute top-4 md:top-8 float-right right-4 h-8 w-8 hidden md:block py-0 px-2.5 cursor-pointer bg-transparent border-none outline-none border-r-0"
				onClick={() => {
					if (openNav == "0") {
						set_openNav("28")

						set_burger1(close_burger + " -rotate-45")
						set_burger2(close_burger + " rotate-45")
					} else {
						set_openNav("0")

						set_burger1(burger + " translate-y-2.5")
						set_burger2(burger + " translate-y-4")
					}
				}}>
				<div className={burger1}></div>
				<div className={burger2}></div>
			</div>
		</div>
	)
}
export default Header
