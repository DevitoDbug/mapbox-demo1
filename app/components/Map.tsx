"use client";

import { useCallback, useEffect, useState } from "react";
import { MapProvider, useMap } from "react-map-gl";
import { Location, RootObject } from "@/types/mapbox";
import MapboxMap from "@/app/components/MapboxMap";
import {
	LocationContextProvider,
	useLocationCoordinatesContext,
} from "../context/LocationCoordinatesContext";
import { getDrivingDirections } from "../actions/DirectionAction";
import MapSearchBox from "./MapSearchBox";
import RouteInfo from "./RouteInfo";

const MapComponent = () => {
	const {
		StartLocation,
		SetStartLocation,
		DestinationLocation,
		SetDestinationLocation,
		SetSearchStartText,
		SetSearchDestinationText,
		SearchDestinationText,
		SearchStartText,
	} = useLocationCoordinatesContext();

	const [routeLocations, setRouteLocations] = useState<
		Location[] | undefined
	>(undefined);
	const { mainMap } = useMap();

	const [distance, setDistance] = useState<number | undefined>(undefined);

	const handleFitBounds = useCallback(() => {
		if (mainMap && StartLocation && DestinationLocation) {
			const bounds: [[number, number], [number, number]] = [
				[
					Math.min(StartLocation[0], DestinationLocation[0]),
					Math.min(StartLocation[1], DestinationLocation[1]),
				],
				[
					Math.max(StartLocation[0], DestinationLocation[0]),
					Math.max(StartLocation[1], DestinationLocation[1]),
				],
			];
			mainMap.fitBounds(bounds, {
				padding: 50, // Adjust padding as needed
			});
		}
	}, [mainMap, StartLocation, DestinationLocation]);

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

	const handleGetDrivingDirections = useCallback(async () => {
		if (StartLocation && DestinationLocation) {
			const response = await getDrivingDirections([
				StartLocation,
				DestinationLocation,
			]);
			return response;
		}
		return null;
	}, [StartLocation, DestinationLocation]);

	useEffect(() => {
		if (StartLocation) {
			handleFlyToLocation(StartLocation);
		}
	}, [StartLocation, handleFlyToLocation]);

	useEffect(() => {
		if (DestinationLocation) {
			handleFlyToLocation(DestinationLocation);
		}
	}, [DestinationLocation, handleFlyToLocation]);

	useEffect(() => {
		const fetchDirections = async () => {
			if (StartLocation && DestinationLocation) {
				const response: RootObject = await handleGetDrivingDirections();
				if (response?.routes[0]?.geometry?.coordinates) {
					setRouteLocations(response.routes[0].geometry.coordinates);
					setDistance(response.routes[0].distance);
					handleFitBounds();
				}
			}
		};
		fetchDirections();
	}, [
		StartLocation,
		DestinationLocation,
		handleGetDrivingDirections,
		handleFitBounds,
	]);

	return (
		<div className="w-screen p-2 gap-2 flex flex-col md:flex-row ">
			<div className="md:w-1/2 ">
				<MapboxMap
					SetDestinationLocation={SetDestinationLocation}
					SetStartLocation={SetStartLocation}
					SetDestinationLocationText={SetSearchDestinationText}
					SetStartLocationText={SetSearchStartText}
					MarkerLocations={{
						StartLocation: StartLocation,
						DestinationLocation: DestinationLocation,
					}}
					RouteLocations={routeLocations}
					Id="mainMap"
				/>
			</div>
			<div className="md:w-1/2 ">
				<h1>Location Search</h1>
				<MapSearchBox
					SetLocationCoordinates={SetStartLocation}
					SearchBoxTitle="Start"
					SearchText={SearchStartText}
					SetSearchText={SetSearchStartText}
				/>
				<MapSearchBox
					SetLocationCoordinates={SetDestinationLocation}
					SearchBoxTitle="Destination"
					SearchText={SearchDestinationText}
					SetSearchText={SetSearchDestinationText}
				/>
				{distance && (
					<RouteInfo distance={distance} costPerMeter={180} />
				)}
			</div>
		</div>
	);
};

const Map = () => (
	<MapProvider>
		<LocationContextProvider>
			<MapComponent />
		</LocationContextProvider>
	</MapProvider>
);

export default Map;
