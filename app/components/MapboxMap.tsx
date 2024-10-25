"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Map, { Layer, Marker, MarkerDragEvent, Source } from "react-map-gl";
import { GeocodingResponse, Location } from "@/types/mapbox";
import { getGeoCodingData } from "@/app/actions/GeoCodingAction";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MarkerLocations {
	StartLocation?: Location;
	DestinationLocation?: Location;
}

type MapboxMapProps = {
	MarkerLocations?: MarkerLocations;
	RouteLocations?: Location[];
	SetStartLocation?: Dispatch<SetStateAction<Location | undefined>>;
	SetDestinationLocation?: Dispatch<SetStateAction<Location | undefined>>;
	SetStartLocationText?: Dispatch<SetStateAction<string>>;
	SetDestinationLocationText?: Dispatch<SetStateAction<string>>;
	Id?: string;
};

const MapboxMap = ({
	MarkerLocations,
	RouteLocations,
	SetStartLocation,
	SetDestinationLocation,
	SetStartLocationText,
	SetDestinationLocationText,
	Id,
}: MapboxMapProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

	const [initialViewState, setInitialViewState] = useState({
		longitude: 36.8219,
		latitude: -1.2921,
	});

	/**
	 * Function to handle the dragging of the marker
	 *  and update the location stored in the context or some other state
	 *
	 * @param event
	 * @param updateLocationFunction - Function to update the location stored in the context or some other state
	 * @param updateLocationNameFunction - Function to update the name of the location in the context or some other state
	 */
	const handleDragMarker = async (
		event: MarkerDragEvent,
		updateLocationFunction: Dispatch<SetStateAction<Location | undefined>>,
		updateLocationNameFunction?: Dispatch<SetStateAction<string>>
	) => {
		const lngLat = event.lngLat;
		updateLocationFunction([lngLat.lng, lngLat.lat]);
		const data: GeocodingResponse = await getGeoCodingData([
			lngLat.lng,
			lngLat.lat,
		]);

		// Updating the text on the search box to display the current name
		// of the location in which the user dragged the pin to
		if (data?.features && data?.features?.length > 0) {
			const locationName = data?.features?.[0]?.place_name;
			if (updateLocationNameFunction !== undefined) {
				updateLocationNameFunction(locationName);
			}
		} else {
			if (updateLocationNameFunction !== undefined) {
				updateLocationNameFunction("---");
			}
		}
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

	// we need to get the location of the Use
	useEffect(() => {
		const location = window.navigator.geolocation;
		location.getCurrentPosition((position) => {
			setInitialViewState({
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
			});
			SetStartLocation?.([
				position.coords.longitude,
				position.coords.latitude,
			]);
		});
	}, [SetStartLocation]);

	return (
		<Map
			mapboxAccessToken={mapboxAccessToken}
			initialViewState={{
				longitude: initialViewState.longitude,
				latitude: initialViewState.latitude,
				zoom: 12,
			}}
			style={{ width: "100%", height: 500 }}
			mapStyle="mapbox://styles/mapbox/streets-v11"
			id={Id}
			dragPan={!isDragging}
			dragRotate={!isDragging}
		>
			{/* Add the start location marker */}
			{MarkerLocations?.StartLocation && (
				<Marker
					latitude={MarkerLocations.StartLocation[1]}
					longitude={MarkerLocations.StartLocation[0]}
					draggable={true}
					onDragStart={() => setIsDragging(true)}
					onDragEnd={(event) => {
						setIsDragging(false);
						if (SetStartLocation !== undefined) {
							handleDragMarker(
								event,
								SetStartLocation,
								SetStartLocationText
							);
						}
					}}
				>
					<div className="text-xl">📍</div>
				</Marker>
			)}

			{/* Add the destination location marker */}
			{MarkerLocations?.DestinationLocation && (
				<Marker
					latitude={MarkerLocations.DestinationLocation[1]}
					longitude={MarkerLocations.DestinationLocation[0]}
					draggable={true}
					onDragStart={() => setIsDragging(true)}
					onDragEnd={(event) => {
						setIsDragging(false);
						if (SetDestinationLocation !== undefined) {
							handleDragMarker(
								event,
								SetDestinationLocation,
								SetDestinationLocationText
							);
						}
					}}
				>
					<div className="text-xl">📍</div>
				</Marker>
			)}

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
						"line-color": "#0000FF",
						"line-width": 3,
					}}
				/>
			</Source>
		</Map>
	);
};

export default MapboxMap;
