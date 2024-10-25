export interface CountryContext {
	id: string;
	name: string;
	country_code: string;
	country_code_alpha_3: string;
}

export interface PlaceContext {
	id: string;
	name: string;
}

export interface Context {
	country: CountryContext;
	place?: PlaceContext;
}

export interface Suggestion {
	name: string;
	mapbox_id: string;
	feature_type: string;
	place_formatted: string;
	context: Context;
	language: string;
	maki: string;
	metadata: Record<string, string | number | boolean>;
	distance: number;
}

export interface MapboxSearchResponseData {
	suggestions: Suggestion[];
	attribution: string;
	response_id: string;
}

// Type for a routable point with name, latitude, and longitude
interface RoutablePoint {
	name: string;
	latitude: number;
	longitude: number;
}

// Type for coordinates with latitude, longitude, and an array of routable points
interface Coordinates {
	latitude: number;
	longitude: number;
	routable_points: RoutablePoint[];
}

// Type for country context
export interface CountryContext {
	name: string;
	country_code: string;
	country_code_alpha_3: string;
}

// Type info for the retrieve endpoint
// Type for region context
interface RegionContext {
	name: string;
	region_code: string;
	region_code_full: string;
}

// Type for postcode context
interface PostcodeContext {
	name: string;
}

// Type for place context
export interface PlaceContext {
	name: string;
}

// Type for neighborhood context
interface NeighborhoodContext {
	name: string;
}

// Type for street context
interface StreetContext {
	name: string;
}

// Type for the context of a location (country, region, postcode, etc.)
interface LocationContext {
	country: CountryContext;
	region: RegionContext;
	postcode: PostcodeContext;
	place: PlaceContext;
	neighborhood: NeighborhoodContext;
	street: StreetContext;
}

// Type for external IDs like SafeGraph and Foursquare
interface ExternalIDs {
	safegraph: string;
	foursquare: string;
}

// Type for the properties of a feature
interface FeatureProperties {
	name: string;
	mapbox_id: string;
	feature_type: string;
	address: string;
	full_address: string;
	place_formatted: string;
	context: LocationContext;
	coordinates: Coordinates;
	maki: string;
	poi_category: string[];
	poi_category_ids: string[];
	external_ids: ExternalIDs;
	metadata: Record<string, string | number | boolean | object>;
}

export type Location = [number, number];

// Type for the geometry of a feature (e.g., a point with coordinates)
interface Geometry {
	coordinates: Location;
	type: string; // e.g., "Point"
}

// Type for a single feature in the FeatureCollection
interface Feature {
	type: string; // e.g., "Feature"
	geometry: Geometry;
	properties: FeatureProperties;
}

// Type for the entire API response (a FeatureCollection)
export interface FeatureCollection {
	type: string; // e.g., "FeatureCollection"
	features: Feature[];
	attribution: string;
}

// Type info for the directions endpoint
interface Coordinates {
	coordinates: [number, number][];
	type: string; // "LineString"
}

interface RouteLeg {
	admins: Admin[];
	annotation: Annotation;
}

interface Admin {
	iso_3166_1: string; // "KE" (Country code)
	iso_3166_1_alpha3: string; // "KEN" (Country code alpha3)
}

interface Annotation {
	maxspeed: Maxspeed[];
}

interface Maxspeed {
	unknown: boolean;
}

interface Route {
	distance: number; // e.g. 431460.5
	duration: number; // e.g. 34715.531
	geometry: Coordinates;
	legs: RouteLeg[];
}

export interface RootObject {
	Objectcode: string; // "Ok"
	routes: Route[];
}

// Type for the response from the Mapbox Geocoding API
// Type for a single feature in the response
interface GeocodingFeature {
	id: string;
	type: "Feature";
	place_type: string[];
	relevance: number;
	properties: {
		mapbox_id: string;
		[key: string]: unknown;
	};
	text: string;
	place_name: string;
	bbox?: [number, number, number, number];
	center: [number, number];
	geometry: {
		type: "Point";
		coordinates: [number, number];
	};
	context?: Array<{
		id: string;
		mapbox_id: string;
		text: string;
		short_code?: string;
		wikidata?: string;
	}>;
}

export interface GeocodingResponse {
	type: string;
	query: [number, number];
	features: GeocodingFeature[];
}
