import React, { useState } from "react"
import cl from "/public/cerp-logo.svg"
interface P {
	VisibleInd: number
	SectionInd: Record<string, number>
}

// TODO: nav open/close should be entirely handled in header, not with props
const Header: React.FC<P> = ({
	VisibleInd,
	SectionInd,
	openNav,
	set_openNav,
	NavBName,
	set_NavBName,
}) => {
	return (
		<div className="header">
			<div className="logo-header-logo">
				<div className="cerpHeader">
					<a
						className="navbar-brand"
						href="https://www.cerp.org.pk/index.php">
						<img src="cerp-logo.png" alt="Image Description" />
						{/* https://www.cerp.org.pk/assets/img/logo/logo-1.png */}
						{/* https://mischool.pk/static/media/cerp-logo1.1e74dec1.png */}
					</a>
					<div className="header-buttons">
						<ul className="header-list">
							<li>
								<a href="https://pakistangrowthstory.org">
									Blog
								</a>
							</li>
							<li className="divider">|</li>
							<li>
								<a href="https://www.cerp.org.pk/pages/podcasts">
									Podcasts
								</a>
							</li>
							<li className="divider">|</li>
							<li>
								<a href="https://www.cerp.org.pk/pages/news">
									News
								</a>
							</li>
							<li className="divider">|</li>
							<li>
								<a href="https://www.cerp.org.pk/pages/events">
									Events
								</a>
							</li>
							<li className="divider">|</li>
							<li>
								<a href="https://www.cerp.org.pk/pages/careers">
									Careers
								</a>
							</li>
							<li className="divider">|</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="topnav-container">
				<div className="topnav" style={{ height: openNav }}>
					<a
						className={String(VisibleInd === SectionInd["Sec_1"])}
						href="#LineTemp">
						Line Template
					</a>
					<a
						className={String(VisibleInd === SectionInd["Sec_2"])}
						href="#HorzBarTemp">
						Horz Bar Template
					</a>
				</div>
			</div>
			<div
				id={NavBName}
				className="Nav_Button"
				onClick={() => {
					if (openNav == "0vh") {
						set_openNav("15vh")
						set_NavBName("Close")
					} else {
						set_openNav("0vh")
						set_NavBName("Navigation")
					}
				}}>
				{" "}
				<div className="Burger"></div>
				<div className="Burger2"></div>
			</div>
		</div>
	)
}
export default Header
