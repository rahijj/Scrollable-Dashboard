import React, { useEffect } from 'react'
// @ts-ignore
import DeckGL from '@deck.gl/react'
//@ts-ignore
import { GeoJsonLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import { RouteComponentProps } from 'react-router'

import 'mapbox-gl/dist/mapbox-gl.css'
import './style.css'

type P = {};

const mapbox_token = "pk.eyJ1IjoidGFpbXVyMzgiLCJhIjoiY2pucWZuY3BtMGZ6dTNxcG53NDh1N3lxZyJ9.795xICQFpWXrTJxF10EJfw"
const mapbox_style_url = "mapbox://styles/taimur38/cjnu7h5pn4jel2rqk4pbo74ke"

const Map: React.FunctionComponent<P> = (props) => {

	useEffect(() => {
		// effect
	}, [])

	const viewState = {
		latitude: 31.1704,
		longitude: 72.7097,
		zoom: 4,
		pitch: 0,
		bearing: 0
	}

	return <div className="map-component">
		<div key="" className="map-wrapper">
			<DeckGL
				initialViewState={viewState}
				controller={true}
				width="100%"
				height="100%">

				<StaticMap mapboxApiAccessToken={mapbox_token} mapStyle={mapbox_style_url} width={100} height={100} />

			</DeckGL>
		</div>
	</div>
}

export default Map;