import React from 'react';
import { useState, useEffect} from 'react'
import CameraComponent  from '../components/camera'
import Weight from '../components/weight'
import Summary from '../components/infield_summary'
import {ArrowRight} from '../icons/icons'
import {LocalStore} from '../lib/storage'

const InField = (props) => {
    const [status, setStatus] = useState(0)
    const [weight, setWeight] = useState()
    const [data, setData] = useState({weight: 0, coordinates: {latitude:0,longitude:0, accuracy: 0, altitude: 0, altitudeAccuracy: 0}, image: null, ts: 0})
    
    useEffect(() => {
        // Check if the browser supports geolocation
        if (navigator.geolocation) {
          // Get the user's current position
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, accuracy, altitude, altitudeAccuracy } = position.coords;
              let _data = Object.assign({},data)
              _data.coordinates = {latitude, longitude, accuracy, altitude, altitudeAccuracy}
              setData(_data);
            },
            (error) => {
              console.error('Error getting user location:', error.message);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      })

      let setWeightData = () => {
        let _data = Object.assign({},data)
        _data.weight = weight
        setData(_data)
        setWeight(0)
        setStatus(1)
      }

      let setImageData = (imgData) => {
        let _data = Object.assign({},data)
        _data.image = imgData
        _data.ts = Date.now()
        setData(_data)
        setStatus(2)
      }

      const save = async () => {
        let collected = LocalStore.addCollectedData(data)
        console.log(collected.id())
        
      }

      return (
        <>
            <div class="text-center text-base m-2">In-Field Collection</div>
            {status===0 && 
                <>
                <Weight setWeight={setWeight} value={weight}/>
                <div class="mx-auto text-center"><button onClick={setWeightData} disabled={!weight || weight.toString()===''} class={(!weight || weight.toString()==='')?'text-slate-400':''}>Next <ArrowRight/></button></div>
                </>
            }
            {status===1 && 
                <>
                <CameraComponent saveImage={setImageData}/>
                </>
            }
            {status===2 && 
                <Summary {...data} save={save}/>
            }
            
        </>
      )
}

export default InField

