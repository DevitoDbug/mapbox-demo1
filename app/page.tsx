"use client";

import Map from "react-map-gl";

export default function Home() {
	const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
	if (!mapboxAccessToken) {
		throw new Error("Mapbox access token is required");
	}

	return (
		<div>
			<Map
				mapboxAccessToken={mapboxAccessToken}
				initialViewState={{
					longitude: 36.8219,
					latitude: 1.2921,
					zoom: 7,
				}}
				style={{ width: 600, height: 400 }}
				mapStyle="mapbox://styles/mapbox/streets-v9"
			/>
		</div>
	);
}
