import React from 'react';
import { useState, useEffect} from 'react'
import {TractorIcon, BackIcon, ArrowRightIcon, QRIcon, BucketIcon} from '../icons/icons'
import Weight from '../components/weight'
import {QR} from '../components/qr'
import CollectionSummary from '../components/collection_summary'

const CollectionPoint = (props) => {
    const [status, setStatus] = useState(0)
    const [weight, setWeight] = useState()
    const [data, setData] = useState({weight: 0, coordinates: null, ts: 0, bucketID: null, tractorBinID: null})

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

    const setWeightData = () => {
        let _data = Object.assign({},data)
        _data.weight = weight
        setData(_data)
        setWeight(0)
        setStatus(1)
    }

    const bucketIDResult = (result) => {
        if(data.bucketID) return true
        console.log('Result:' + result)
        if(result.substr(0,4)!=='bkt:') return false
        result = parseInt(result.substring(4))
        console.log('result: ' + result)
        let _data = Object.assign({},data)
        _data.bucketID = result
        setData(_data)
        setStatus(2)
        return true
    }

    const tractorBinIDResult = (result) => {
        if(data.tractorBinID) return true
        console.log('Result:' + result)
        if(result.substr(0,4)!=='bin:') return false
        result = parseInt(result.substring(4))
        console.log('result: ' + result)
        let _data = Object.assign({},data)
        _data.tractorBinID = result
        _data.ts = Date.now()
        setData(_data)
        setStatus(3)
        return true
    }

    const save = () => {
        
    }

    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center mb-3"><TractorIcon /> <div class="inline align-middle ml-2">Collection Point</div></div>
        {status===0 && 
            <>
                
                <Weight setWeight={setWeight} value={weight}/>
                <div class="mx-auto text-center font-medium mt-2"><button onClick={setWeightData} disabled={!weight || weight.toString()===''} class={(!weight || weight.toString()==='')?'text-slate-400':''}>Next <ArrowRightIcon/></button></div>
            </>
        }
        {status===1 &&
            <>
                <div class="text-center align-middle mb-2 font-medium"><QRIcon/> <div class="inline align-middle">Please scan the bucket</div> <BucketIcon/></div>
                <QR result={bucketIDResult} />
            </>
        }
        {status===2 &&
            <>
                <div class="text-center align-middle mb-2 font-medium"><QRIcon/> <div class="inline align-middle">Please scan the bin</div> <TractorIcon/></div>
                <QR result={tractorBinIDResult} />
            </>
        }
        {status===3 && 
                <CollectionSummary {...data} save={save}/>
            }
        
        </>
    )
}

export default CollectionPoint