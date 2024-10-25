"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FeatureCollection, Location, Suggestion } from "@/types/mapbox";
import { getLocationCoordinates } from "../actions/RetrieveAction";
import { searchLocationByText } from "../actions/SuggestionAction";

export type LocationSearchProps = {
	SetLocationCoordinates: Dispatch<SetStateAction<Location | undefined>>;
	SearchBoxTitle?: string;
	SearchText: string; // this can either be the start or destination text
	SetSearchText: Dispatch<SetStateAction<string>>; // this can either be the start or destination text
};

const MapSearchBox = ({
	SetLocationCoordinates,
	SearchBoxTitle,
	SearchText,
	SetSearchText,
}: LocationSearchProps) => {
	if (!SetLocationCoordinates) {
		throw new Error("SetLocationCoordinates is required");
	}

	const locationSuggestionRef = useRef<HTMLDivElement>(null);
	const [locationSuggestions, setLocationSuggestions] = useState<
		Suggestion[]
	>([]);
	const [locationLoadingState, setLocationLoadingState] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	const [showLocationSuggestions, setShowLocationSuggestions] =
		useState(false);

	const loadSuggestions = async (locationString: string) => {
		setLocationLoadingState(true);
		setSearchError(null);
		setShowLocationSuggestions(true);

		try {
			const results = await searchLocationByText(locationString);
			setLocationSuggestions(results);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setSearchError(err.message || "Something went wrong");
			} else {
				setSearchError("Something went wrong");
			}
		} finally {
			setLocationLoadingState(false);
		}
	};

	const handleLocationCoordinates = async (mapboxId: string) => {
		try {
			const coordinatesData: FeatureCollection =
				await getLocationCoordinates(mapboxId);
			SetLocationCoordinates(
				coordinatesData?.features[0]?.geometry?.coordinates
			);
		} catch {
			console.log("Error fetching location coordinates");
		}
	};

	// Close suggestions dropdown when clicked outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				locationSuggestionRef.current &&
				!locationSuggestionRef.current.contains(event.target as Node)
			) {
				setShowLocationSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [locationSuggestionRef]);

	// Load suggestions when user types
	useEffect(() => {
		if (SearchText?.trim() === "") {
			setLocationSuggestions([]);
			return;
		}

		const timeout = setTimeout(() => {
			if (showLocationSuggestions) {
				loadSuggestions(SearchText);
				setShowLocationSuggestions(true);
			}
		}, 500);

		return () => clearTimeout(timeout);
	}, [SearchText, showLocationSuggestions]);

	return (
		<div className="mb-3">
			<div className="px-2">
				{SearchBoxTitle && (
					<h2 className="m-0 p-0 text-primary">{SearchBoxTitle}</h2>
				)}
				<div className="relative flex gap-2">
					<input
						type="text"
						placeholder="Search for a location..."
						name={"location"}
						className="w-auto min-w-40 p-2 border border-gray-300 rounded "
						value={SearchText ?? ""}
						onChange={(e) => {
							SetSearchText(e.target.value);
							setShowLocationSuggestions(true);
						}}
					/>
				</div>
			</div>
			{/* Render loading or error messages */}
			{locationLoadingState && <p>Loading...</p>}
			{searchError && <p className="text-red-500">{searchError}</p>}
			{/* Render the start location search suggestions as a list */}
			{showLocationSuggestions && locationSuggestions?.length > 0 && (
				<div
					ref={locationSuggestionRef}
					className="w-auto suggestions-dropdown absolute z-10  rounded p-2 shadow bg-white "
				>
					<ul className="flex gap-1 flex-col min-w-40">
						{locationSuggestions.map((suggestion, index) => (
							<li
								key={suggestion.mapbox_id}
								className={cn(
									"flex flex-col hover:bg-gray-200 p-2 cursor-pointer rounded-sm ",
									index != locationSuggestions?.length - 1
										? "border-b border-gray-400  pb-2"
										: ""
								)}
								onClick={() => {
									SetSearchText(
										`${suggestion.name} ${suggestion.place_formatted}`
									);
									setShowLocationSuggestions(false);

									// we need to also get the id some way.
									handleLocationCoordinates(
										suggestion.mapbox_id
									);
								}}
							>
								<span>{suggestion.name}</span>
								<small>{suggestion.place_formatted}</small>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MapSearchBox;
