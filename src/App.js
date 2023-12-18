import React from 'react';
import { useState, useEffect} from 'react'

//https://github.com/tailwindlabs/tailwindcss-forms
//https://tailwindcss.com/docs/margin


function App() {
  const [coordinates, setCoordinates] = useState({latitude:0,longitude:0, accuracy: 0, altitude: 0, altitudeAccuracy: 0})
  const [data, setData] = useState(null)

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, altitude, altitudeAccuracy } = position.coords;
          setCoordinates({ latitude, longitude, accuracy, altitude, altitudeAccuracy});
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <div class="container mx-auto text-center text-slate-600 p-3 text-lg font-semibold">
        Hello world!
      </div>
      <div class="container mx-auto text-center mt-10">
        <div class="flex flex-row content-center h-7">
          <div class="basis-1/4 align-middle">Number</div>
          <input type="number" class="rounded-lg basis-1/2"/>
        </div>
      </div>
    </div>
    
  );
}

export default App;
