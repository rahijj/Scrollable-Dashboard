import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import Map from 'components/Map'

import 'mapbox-gl/dist/mapbox-gl.css'
import './style.css'

type P = {} & RouteComponentProps;

const mapbox_token = "pk.eyJ1IjoidGFpbXVyMzgiLCJhIjoiY2pucWZuY3BtMGZ6dTNxcG53NDh1N3lxZyJ9.795xICQFpWXrTJxF10EJfw"
const mapbox_style_url = "mapbox://styles/taimur38/cjnu7h5pn4jel2rqk4pbo74ke"

const dashboard: React.FunctionComponent<P> = (props) => {


	const viewState = {
		latitude: 31.1704,
		longitude: 72.7097,
		zoom: 4,
		pitch: 0,
		bearing: 0
	}

	return <div className="dashboard-page">
		Hello

		<Map />
	</div>
}

export default dashboard;