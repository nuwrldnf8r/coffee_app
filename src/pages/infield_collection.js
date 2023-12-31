import React from 'react';
import { useState, useEffect} from 'react'
import CameraComponent  from '../components/camera'
import Weight from '../components/weight'
import Summary from '../components/infield_summary'
import {ArrowRightIcon, CameraIcon, QRIcon, BucketIcon} from '../icons/icons'
import {LocalStore} from '../lib/storage'
import {QR} from '../components/qr'

const InField = (props) => {
    const [status, setStatus] = useState(0)
    const [weight, setWeight] = useState()
    const [data, setData] = useState({weight: 0, coordinates: null, image: null, ts: 0, bucketID: null})
    
    useEffect(() => {
        if(!data.coordinates){
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
        }
      })

      let setWeightData = () => {
        let _data = Object.assign({},data)
        _data.weight = weight
        setData(_data)
        setWeight(0)
        setStatus(2)
      }

      let setImageData = (imgData) => {
        console.log('here')
        if(data.image) return
        let _data = Object.assign({},data)
        _data.image = imgData
        _data.ts = Date.now()
        setData(_data)
        console.log(_data.image)
        setStatus(4)
      }

      let qrResult = (result) => {
        console.log('here')
        if(data.QR) return true
        console.log('Result:' + result)
        if(result.substr(0,4)!=='bkt:') return false
        result = parseInt(result.substring(4))
        console.log('result: ' + result)
        let _data = Object.assign({},data)
        _data.bucketID = result
        setData(_data)
        setStatus(3)
        return true
      }

      const save = async () => {
        let collected = LocalStore.addCollectedData(data)
        console.log(collected.id())
        
      }

      return (
        <>  
            <div class="text-center text-base m-2 font-medium">In-Field Collection</div>
            {status===0 && 
                <>
                  
                  <div class="mx-auto text-center">Harvester Info goes here</div>
                  <div class="mx-auto text-center font-medium mt-2"><button onClick={()=>setStatus(1)}>Next <ArrowRightIcon/></button></div>
                </>
            }
            {status===1 && 
              <>
                <Weight setWeight={setWeight} value={weight}/>
                <div class="mx-auto text-center font-medium mt-2"><button onClick={setWeightData} disabled={!weight || weight.toString()===''} class={(!weight || weight.toString()==='')?'text-slate-400':''}>Next <ArrowRightIcon/></button></div>
              </>
            }
            {status===2 && 
              <>
              <div class="text-center align-middle mb-2 font-medium"><QRIcon/> <div class="inline align-middle">Please scan the bucket</div> <BucketIcon/></div>
              <QR result={qrResult} />
              </>
            }
            {status===3 && 
                <>
                <div class="text-center align-middle mb-2 font-medium"><CameraIcon/> <div class="inline align-middle">Take a photo of the bucket</div> <BucketIcon/></div>
                <CameraComponent saveImage={setImageData}/>
                </>
            }
            {status===4 && 
                <Summary {...data} save={save}/>
            }
            
        </>
      )
}

export default InField

