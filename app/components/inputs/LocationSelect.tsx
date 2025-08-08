'use client';

import AsyncSelect from "react-select/async";
import axios from "axios";
import { useCallback } from "react";

export type CountrySelectValue = {
  latlng: number[];
  label: string;
  value: string;
  region: string;
};

interface LocationSelectProps {
  onChange: (value: CountrySelectValue) => void;
  value?: CountrySelectValue;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ onChange, value }) => {
  const fetchOptions = useCallback(async (input: string): Promise<CountrySelectValue[]> => {
    if (!input || input.length < 3) return [];

    const res = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`,
      {
        params: {
          access_token: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
          country: "BR", // Brazil only
          limit: 5,
        },
      }
    );

    return res.data.features.map((feature: any) => ({
      value: feature.place_name,
      label: feature.place_name,
      latlng: [feature.center[1], feature.center[0]], // [lat, lng]
      region:
        feature.context?.find((c: any) => c.id.includes("region"))?.text || "",
    }));
  }, []);

  return (
    <div>
      <AsyncSelect
        placeholder="Digite seu endereço..."
        defaultOptions={false}
        loadOptions={fetchOptions}
        onChange={(val) => onChange(val as CountrySelectValue)}
        value={value}
        isClearable
      />
    </div>
  );
};

export default LocationSelect;