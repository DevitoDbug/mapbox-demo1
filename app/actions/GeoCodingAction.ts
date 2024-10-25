import { Location } from "@/types/mapbox";

export const getGeoCodingData = async (locations: Location) => {
	const GEOCODING_BASE_URL =
		process.env.NEXT_PUBLIC_MAPBOX_GEOCODING_BASE_URL;
	const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

	const res = await fetch(
		`${GEOCODING_BASE_URL}/${locations[0]},${locations[1]}.json?access_token=${MAPBOX_API_TOKEN}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const directionsData = await res.json();
	return directionsData;
};
