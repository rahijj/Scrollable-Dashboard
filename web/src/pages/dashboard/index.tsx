import React from 'react'
import Map from 'components/Map'
import { RouteComponentProps } from 'react-router'
type P = {} & RouteComponentProps;

import 'mapbox-gl/dist/mapbox-gl.css'

const mapbox_token = "pk.eyJ1IjoidGFpbXVyMzgiLCJhIjoiY2pucWZuY3BtMGZ6dTNxcG53NDh1N3lxZyJ9.795xICQFpWXrTJxF10EJfw"
const mapbox_style_url = "mapbox://styles/taimur38/cjnu7h5pn4jel2rqk4pbo74ke"


const Dashboard = () => {
	console.log("here")
	const viewState = {
		latitude: 31.1704,
		longitude: 72.7097,
		zoom: 4,
		pitch: 0,
		bearing: 0
	}
	return (<>
		<header className="bg-white shadow">
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold leading-tight text-gray-900">
					Dashboard
				</h1>
			</div>
		</header>
		<main>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
						<Map />
					</div>
				</div>
			</div>
		</main>
	</>
	)
}

export default Dashboard;
