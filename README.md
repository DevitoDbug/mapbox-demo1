# Next.js Mapbox Integration

This project demonstrates how to integrate Next.js with Mapbox to create a responsive and interactive map application. The application includes features such as location suggestions, driving directions, and draggable markers that update both coordinates and input text.

## Features

-   **Location Suggestions**: Provides suggestions for locations as you type in the search box.
-   **Driving Directions**: Displays driving directions from the start location to the destination.
-   **Draggable Markers**: Allows users to drag markers to new locations, updating both the coordinates and the input text.
-   **Responsive Design**: The map and input boxes are responsive, ensuring a good user experience on different devices.

## Getting Started

### Prerequisites

-   Node.js and npm installed on your machine.
-   A Mapbox account and an access token.

### Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/DevitoDbug/mapbox-demo1git

    cd mapbox-demo1
    ```

2.  Install the dependencies:

    ```sh
    npm install
    ```

3.  Create a `.env.local` file in the root directory and add your Mapbox access token:

```sh
NEXT_PUBLIC_MAPBOX_API_TOKEN=your_mapbox_access_token

# URLs used
NEXT_PUBLIC_MAPBOX_SEARCH_BASE_URL=https://api.mapbox.com/search/searchbox/v1/suggest
NEXT_PUBLIC_MAPBOX_RETRIEVE_BASE_URL=https://api.mapbox.com/search/searchbox/v1/retrieve
NEXT_PUBLIC_MAPBOX_DRIVING_BASE_URL=https://api.mapbox.com/directions/v5/mapbox/driving
NEXT_PUBLIC_MAPBOX_GEOCODING_BASE_URL=https://api.mapbox.com/geocoding/v5/mapbox.places
```

# Running the Application

Start the development server:

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

-   **components/**: Contains the React components used in the application.

    -   `MapboxMap.tsx`: The main map component that integrates with Mapbox.
    -   `MapSearchBox.tsx`: The search box component for entering locations.
    -   `RouteInfo.tsx`: Displays the distance and cost of the route.

-   **context/**: Contains the context for managing state.

    -   `LocationCoordinatesContext.tsx`: Context for managing start and destination locations and search texts.

-   **actions/**: Contains server actions for fetching data.

    -   `GeoCodingAction.ts`: Fetches geocoding data from Mapbox.

-   **types/**: Contains TypeScript types used in the application.
    -   `mapbox.ts`: Types for Mapbox-related data.

## Usage

### Searching for Locations

1. Enter a location in the search box.
2. Select a suggestion from the dropdown list.
3. The map will update to show the selected location.

### Getting Driving Directions

1. Enter a start location and a destination in the search boxes.
2. The map will display the driving route between the two locations.
3. The `RouteInfo` component will display the distance and cost of the route.

### Dragging Markers

1. Drag the start or destination marker to a new location on the map.
2. The coordinates and input text will update to reflect the new location.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

-   [Next.js](https://nextjs.org/)
-   [Mapbox](https://www.mapbox.com/)
-   [React](https://reactjs.org/)
-   [React Map GL](https://visgl.github.io/react-map-gl/)
