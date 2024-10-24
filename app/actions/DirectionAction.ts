import { Location } from "@/types/mapbox";

export const getDrivingDirections = async (locations: Location[]) => {
	const DIRECTIONS_BASE_URL = process.env.NEXT_PUBLIC_MAPBOX_DRIVING_BASE_URL;
	const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

	const res = await fetch(
		`${DIRECTIONS_BASE_URL}/${locations
			.map((location) => `${location[0]},${location[1]}`)
			.join(
				";"
			)}?annotations=maxspeed&overview=full&geometries=geojson&access_token=${MAPBOX_API_TOKEN}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const directionsData = await res.json();
	return directionsData;
};
