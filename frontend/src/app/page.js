"use client";

import FullPageMap from "../components/map.jsx";
import React, { useState } from "react";

export default function Home() {

  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <main>
      {instructionsVisible && mapLoaded && (
        <>
        <div className="fixed inset-0 bg-gray-500 opacity-60 flex items-center justify-center z-15">
        </div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 p-4 z-20 rounded shadow z-10 max-w-md">
          <h2 className="text-lg font-bold mb-2">Information</h2>
          <p className="mb-2">
            Click on any water body on the map to get the maximum wave height for that location on January 1, 2019.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setInstructionsVisible(false)}
          >
            Got it!
          </button>
        </div>
        </>
      )}
      <FullPageMap onLoad={() => setMapLoaded(true)} />
    </main>
  );
}
