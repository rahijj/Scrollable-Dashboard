import React, { useEffect } from "react"
// @ts-ignore
import DeckGL from "@deck.gl/react"
//@ts-ignore
import { GeoJsonLayer } from "@deck.gl/layers"
import { StaticMap } from "react-map-gl"

import "mapbox-gl/dist/mapbox-gl.css"
import "./style.css"

type P = {}

const mapbox_token =
	"pk.eyJ1IjoidGFpbXVyMzgiLCJhIjoiY2pucWZuY3BtMGZ6dTNxcG53NDh1N3lxZyJ9.795xICQFpWXrTJxF10EJfw"
const mapbox_style_url = "mapbox://styles/taimur38/cjnu7h5pn4jel2rqk4pbo74ke"

const Map: React.FunctionComponent<P> = () => {
	useEffect(() => {
		// effect
	}, [])

	const viewState = {
		latitude: 31.1704,
		longitude: 72.7097,
		zoom: 4,
		pitch: 0,
		bearing: 0,
	}

	return (
		<div className="h-full w-full">
			<DeckGL
				initialViewState={viewState}
				controller={true}
				width="100%"
				height="100%">
				<StaticMap
					mapboxApiAccessToken={mapbox_token}
					mapStyle={mapbox_style_url}
					width={100}
					height={100}
				/>
			</DeckGL>
		</div>
	)
}

export default Map
