"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FeatureCollection, Location, Suggestion } from "@/types/mapbox";
import { cn } from "@/lib/utils";
import { getLocationCoordinates } from "../actions/RetrieveAction";
import { searchLocationByText } from "../actions/SuggestionAction";

export type LocationSearchProps = {
	SetLocationCoordinates: Dispatch<SetStateAction<Location | undefined>>;
	SearchBoxTitle?: string;
};

const MapSearchBox = ({
	SetLocationCoordinates: setLocationCoordinates,
	SearchBoxTitle,
}: LocationSearchProps) => {
	if (!setLocationCoordinates) {
		throw new Error("setLocationCoordinates is required");
	}

	const startLocationSuggestionRef = useRef<HTMLDivElement>(null);
	const [startLocationSuggestions, setStartLocationSuggestions] = useState<
		Suggestion[]
	>([]);
	const [startLocationLoadingState, setStartLocationLoadingState] =
		useState(false);
	const [startLocationError, setStartLocationError] = useState<string | null>(
		null
	);
	const [startLocationSearchText, setStartLocationSearchText] =
		useState<string>("");
	const [showStartLocationSuggestions, setShowStartLocationSuggestions] =
		useState(false);

	const loadSuggestions = async (locationString: string) => {
		setStartLocationLoadingState(true);
		setStartLocationError(null);
		setShowStartLocationSuggestions(true);

		try {
			const results = await searchLocationByText(locationString);
			setStartLocationSuggestions(results);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setStartLocationError(err.message || "Something went wrong");
			} else {
				setStartLocationError("Something went wrong");
			}
		} finally {
			setStartLocationLoadingState(false);
		}
	};

	const handleLocationCoordinates = async (mapboxId: string) => {
		try {
			const coordinatesData: FeatureCollection =
				await getLocationCoordinates(mapboxId);
			setLocationCoordinates(
				coordinatesData.features[0].geometry.coordinates
			);
		} catch {
			console.log("Error fetching location coordinates");
		}
	};

	// Close suggestions dropdown when clicked outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				startLocationSuggestionRef.current &&
				!startLocationSuggestionRef.current.contains(
					event.target as Node
				)
			) {
				setShowStartLocationSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [startLocationSuggestionRef]);

	// Load suggestions when user types
	useEffect(() => {
		if (startLocationSearchText?.trim() === "") {
			setStartLocationSuggestions([]);
			return;
		}

		const timeout = setTimeout(() => {
			if (showStartLocationSuggestions) {
				loadSuggestions(startLocationSearchText);
				setShowStartLocationSuggestions(true);
			}
		}, 500);

		return () => clearTimeout(timeout);
	}, [startLocationSearchText, showStartLocationSuggestions]);

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
						value={startLocationSearchText ?? ""}
						onChange={(e) => {
							setStartLocationSearchText(e.target.value);
							setShowStartLocationSuggestions(true);
						}}
					/>
				</div>
			</div>
			{/* Render loading or error messages */}
			{startLocationLoadingState && <p>Loading...</p>}
			{startLocationError && (
				<p className="text-red-500">{startLocationError}</p>
			)}
			{/* Render the start location search suggestions as a list */}
			{showStartLocationSuggestions &&
				startLocationSuggestions.length > 0 && (
					<div
						ref={startLocationSuggestionRef}
						className="w-auto suggestions-dropdown absolute z-10  rounded p-2 shadow bg-white "
					>
						<ul className="flex gap-1 flex-col min-w-40">
							{startLocationSuggestions.map(
								(suggestion, index) => (
									<li
										key={suggestion.mapbox_id}
										className={cn(
											"flex flex-col hover:bg-gray-200 p-2 cursor-pointer rounded-sm ",
											index !=
												startLocationSuggestions.length -
													1
												? "border-b border-gray-400  pb-2"
												: ""
										)}
										onClick={() => {
											setStartLocationSearchText(
												`${suggestion.name} ${suggestion.place_formatted}`
											);
											setShowStartLocationSuggestions(
												false
											);

											// we need to also get the id some way.
											handleLocationCoordinates(
												suggestion.mapbox_id
											);
										}}
									>
										<span>{suggestion.name}</span>
										<small>
											{suggestion.place_formatted}
										</small>
									</li>
								)
							)}
						</ul>
					</div>
				)}
		</div>
	);
};

export default MapSearchBox;
