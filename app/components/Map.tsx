"use client";

import { useCallback, useEffect, useState } from "react";
import { MapProvider, useMap } from "react-map-gl";
import { Location, RootObject } from "@/types/mapbox";
import MapboxMap from "@/components/map/MapboxMap";
import MapSearchBox from "./MapSearchBox";
import { getDrivingDirections } from "../actions/DirectionAction";

const MapComponent = () => {
	const [startLocation, setStartLocation] = useState<Location | undefined>(
		undefined
	);
	const [endLocation, setEndLocation] = useState<Location | undefined>(
		undefined
	);
	const [routeLocations, setRouteLocations] = useState<
		Location[] | undefined
	>(undefined);
	const { mainMap } = useMap();

	const handleFitBounds = useCallback(() => {
		if (mainMap && startLocation && endLocation) {
			const bounds: [[number, number], [number, number]] = [
				[
					Math.min(startLocation[0], endLocation[0]),
					Math.min(startLocation[1], endLocation[1]),
				],
				[
					Math.max(startLocation[0], endLocation[0]),
					Math.max(startLocation[1], endLocation[1]),
				],
			];
			mainMap.fitBounds(bounds, {
				padding: 50, // Adjust padding as needed
			});
		}
	}, [mainMap, startLocation, endLocation]);

	const handleFlyToLocation = useCallback(
		(location: Location, zoom?: number) => {
			if (mainMap) {
				mainMap.flyTo({
					center: location,
					zoom: zoom ?? 14,
				});
			}
		},
		[mainMap]
	);

	useEffect(() => {
		if (startLocation) {
			handleFlyToLocation(startLocation);
		}
	}, [startLocation, handleFlyToLocation]);

	useEffect(() => {
		if (endLocation) {
			handleFlyToLocation(endLocation);
		}
	}, [endLocation, handleFlyToLocation]);

	const handleGetDrivingDirections = useCallback(async () => {
		if (startLocation && endLocation) {
			const response = await getDrivingDirections([
				startLocation,
				endLocation,
			]);
			return response;
		}
		return null;
	}, [startLocation, endLocation]);
	useEffect(() => {
		const fetchDirections = async () => {
			if (startLocation && endLocation) {
				const response: RootObject = await handleGetDrivingDirections();
				if (response.routes[0].geometry.coordinates) {
					setRouteLocations(response.routes[0].geometry.coordinates);
					handleFitBounds();
				}
			}
		};
		fetchDirections();
	}, [
		startLocation,
		endLocation,
		handleGetDrivingDirections,
		handleFitBounds,
	]);

	return (
		<div>
			<h1>Location Search</h1>
			<MapSearchBox
				SetLocationCoordinates={setStartLocation}
				SearchBoxTitle="Start"
			/>
			<MapSearchBox
				SetLocationCoordinates={setEndLocation}
				SearchBoxTitle="Destination"
			/>
			<MapboxMap
				MarkerLocations={
					[startLocation, endLocation].filter(
						(location) => location !== undefined
					) as Location[]
				}
				RouteLocations={routeLocations}
				Id="mainMap"
			/>
		</div>
	);
};

const Map = () => (
	<MapProvider>
		<MapComponent />
	</MapProvider>
);

export default Map;
