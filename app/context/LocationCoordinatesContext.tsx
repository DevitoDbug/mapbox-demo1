"use client";

import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { Location } from "@/types/mapbox";

type LocationCoordinatesContextType = {
	StartLocation: Location | undefined;
	SetStartLocation: Dispatch<SetStateAction<Location | undefined>>;
	DestinationLocation: Location | undefined;
	SetDestinationLocation: Dispatch<SetStateAction<Location | undefined>>;
	SearchStartText: string;
	SetSearchStartText: Dispatch<SetStateAction<string>>;
	SearchDestinationText: string;
	SetSearchDestinationText: Dispatch<SetStateAction<string>>;
};

const LocationContext = createContext<
	LocationCoordinatesContextType | undefined
>(undefined);

const LocationContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [StartLocation, SetStartLocation] = useState<Location | undefined>(
		undefined
	);
	const [DestinationLocation, SetDestinationLocation] = useState<
		Location | undefined
	>(undefined);
	const [SearchStartText, SetSearchStartText] =
		useState<string>("--Your location--");
	const [SearchDestinationText, SetSearchDestinationText] =
		useState<string>("");

	return (
		<LocationContext.Provider
			value={{
				StartLocation,
				SetStartLocation,
				DestinationLocation,
				SetDestinationLocation,
				SearchStartText,
				SetSearchStartText,
				SearchDestinationText,
				SetSearchDestinationText,
			}}
		>
			{children}
		</LocationContext.Provider>
	);
};

/**
 * Custom hook to use the LocationCoordinatesContext
 *
 * This hook provides access to the start and destination locations,
 * as well as their respective setter functions. It ensures that the
 * hook is used within a LocationContextProvider.
 *
 * @returns {LocationCoordinatesContextType} The context value containing
 * startLocation, setStartLocation, destinationLocation, and setDestinationLocation.
 * @throws {Error} If the hook is used outside of a LocationContextProvider.
 */
const useLocationCoordinatesContext = (): LocationCoordinatesContextType => {
	const context = useContext(LocationContext);
	if (context === undefined) {
		throw new Error(
			"useLocationCoordinatesContext must be used within a LocationCoordinatesContextProvider"
		);
	}
	return context;
};

export { LocationContextProvider, useLocationCoordinatesContext };
