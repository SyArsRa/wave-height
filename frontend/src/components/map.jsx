"use client";

import React, { useState } from "react";
import Map, { NavigationControl, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

async function fetchHMax(lat, lon, date) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/hmax?lat=${lat}&lon=${lon}&date=${date}`
    );

    console.log("API response status:", response.status);
    if (!response.ok) {
      if (response.status === 404) {
        return "Error Finding Max Wave Height, Are You Sure This Is A Water Body?";
      }
      return "Failure, please try again later.";
    }

    const data = await response.json();
    return `Max Wave Height:  ${data.max_hmax.toFixed(2)} meters`;
  } catch (err) {
    console.error("Error fetching HMax data:", err);
    return "Failure, please try again later.";
  }
}

function FullPageMap({ onLoad }) {
  const [popupInfo, setPopupInfo] = useState(null);
  const fixedDate = "2019-01-01";

  const handleMapClick = async (event) => {
    const { lng, lat } = event.lngLat;
    setPopupInfo({ lat, lng, hmaxData: "Loading..." });
    const data = await fetchHMax(lat, lng, fixedDate);
    setPopupInfo({ lat, lng, hmaxData: data });
  };

  return (
    <div className="w-[calc(100vw-0.5rem)] h-[calc(100vh-0.5rem)] overflow-hidden right-1 bottom-1 left-1 top-1 rounded-2xl relative">
      <Map
        initialViewState={{ longitude: 0, latitude: 0, zoom: 5 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        projection="mercator"
        className="w-full h-full"
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        onClick={handleMapClick}
        cursor="pointer"
        onLoad={onLoad}
      >
        <NavigationControl position="top-left" />
        {popupInfo && (
          <Popup
            key={`${popupInfo.lat}-${popupInfo.lng}`}
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="top-left"
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="custom-popup"
          >
            <div className="bg-white/95 rounded-lg border-2 border-yellow-600  shadow-lg px-3 py-2 min-w-[200px] text-sm relative">
              <span className="absolute -top-1.5 -left-1.5 w-4 h-3 bg-yellow-600 rounded-full shadow-lg border border-yellow-600"></span>
              <div className="text-xs text-gray-600 mb-1">
                Latitude: {popupInfo.lat.toFixed(4)}° | Longitude: {popupInfo.lng.toFixed(4)}°
              </div>
              <div className="text-xs font-medium text-gray-900">
                {popupInfo.hmaxData}
              </div>
            </div>
          </Popup>
        )}
      </Map>
      
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default FullPageMap;