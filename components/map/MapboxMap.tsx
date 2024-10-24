"use client";

import Map, { Layer, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Location } from "@/types/mapbox";

type MapboxMapProps = {
	MarkerLocations?: Location[];
	RouteLocations?: Location[];
	Id?: string;
};

const MapboxMap = ({ MarkerLocations, RouteLocations, Id }: MapboxMapProps) => {
	const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
	const initialViewState = {
		longitude: 36.8219,
		latitude: -1.2921,
		zoom: 8,
	};

	// Create GeoJSON data for the route
	const routeGeoJSON = {
		type: "Feature",
		geometry: {
			type: "LineString",
			coordinates: RouteLocations,
		},
	};

	if (!mapboxAccessToken) {
		throw new Error("Mapbox access token is required");
	}
	return (
		<div>
			<Map
				mapboxAccessToken={mapboxAccessToken}
				initialViewState={{
					longitude: initialViewState.longitude,
					latitude: initialViewState.latitude,
					zoom: initialViewState.zoom,
				}}
				style={{ width: 600, height: 400 }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				id={Id}
			>
				{MarkerLocations &&
					MarkerLocations.map((location, index) => (
						<Marker
							key={index}
							longitude={location[0]}
							latitude={location[1]}
						>
							<div className="text-xl">📍</div>
						</Marker>
					))}
				{/* Add the route as a line */}
				<Source id="route" type="geojson" data={routeGeoJSON}>
					<Layer
						id="route"
						type="line"
						source="route"
						layout={{
							"line-join": "round",
							"line-cap": "round",
						}}
						paint={{
							"line-color": "#888",
							"line-width": 6,
						}}
					/>
				</Source>
			</Map>
		</div>
	);
};

export default MapboxMap;
