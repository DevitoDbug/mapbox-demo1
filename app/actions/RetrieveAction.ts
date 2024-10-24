export const getLocationCoordinates = async (mapboxId: string) => {
	const RETRIEVE_BASE_URL = process.env.NEXT_PUBLIC_MAPBOX_RETRIEVE_BASE_URL;
	const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

	const res = await fetch(
		`${RETRIEVE_BASE_URL}/${mapboxId}?session_token=[GENERATED-UUID]&access_token=${MAPBOX_API_TOKEN}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const locationData = await res.json();
	return locationData;
};
