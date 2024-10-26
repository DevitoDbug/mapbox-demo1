"use server"

import { MapboxSearchResponseData } from "@/types/mapbox";

export const searchLocationAction = async (formData: FormData) => {
  const searchText = formData.get("location");
  const SEARCH_BASE_URL = process.env.NEXT_PUBLIC_MAPBOX_SEARCH_BASE_URL;

  const res = await fetch(
    `${SEARCH_BASE_URL}?q=${searchText}&language=en&limit=5&session_token=[GENERATED-UUID]&proximity=-0.0236, 37.9062&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}&country=KE`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const searchResults: MapboxSearchResponseData = await res.json();
  return searchResults.suggestions;
};

export const searchLocationByText = async (searchText: string) => {
  const SEARCH_BASE_URL = process.env.NEXT_PUBLIC_MAPBOX_SEARCH_BASE_URL;
  const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

  const res = await fetch(
    `${SEARCH_BASE_URL}?q=${searchText}&language=en&limit=10&session_token=[GENERATED-UUID]&proximity=37.9062,-1.2921&access_token=${MAPBOX_API_TOKEN}&country=KE&types=place,locality,neighborhood,poi`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const searchResults: MapboxSearchResponseData = await res.json();
  return searchResults.suggestions;
};
