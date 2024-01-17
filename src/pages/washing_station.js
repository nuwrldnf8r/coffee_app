import React from 'react';
import { useState, useEffect} from 'react'
import {Shed, BackIcon, ArrowRightIcon, QRIcon, TractorIcon, Bin} from '../icons/icons'
import Weight from '../components/weight'
import {QR} from '../components/qr'
//import CollectionSummary from '../components/collection_summary'
import WashingStationSummary from  '../components/washing_station_summary'
import {ID, LocalStore} from '../lib/storage'

const WashingStation = (props) => {
    const [status, setStatus] = useState(0)
    const [weight, setWeight] = useState()
    const [data, setData] = useState({weight: 0, coordinates: null, ts: 0, tractorBinID: null, washingStationBinID: null,})

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

    const washingStationBinIDResult = (result) => {
        if(data.bucketID) return true
        console.log('Result:' + result)
        if(result.substr(0,6)!=='wsbin:') return false
        result = parseInt(result.substring(6))
        console.log('result: ' + result)
        let _data = Object.assign({},data)
        _data.washingStationBinID = result
        setData(_data)
        setStatus(3)
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
        setStatus(2)
        return true
    }

    const save = () => {
        
        let id = ID.washingStationID(data.coordinates,data.ts,data.weight,data.tractorBinID,data.washingStationBinID)
        console.log('ID: ' + id)
        
        
        if(!id) throw new Error('id undefined')
        let toUpload = LocalStore.getData('toUpload')
        if(!toUpload)toUpload = {washingStation:[]}
        if(!toUpload.washingStation)toUpload.washingStation = []
        if(toUpload.washingStation.length>0 && toUpload.washingStation.filter(itm=>itm.id===id).length>0) {
          props.setPage('dashboard')
          return
        }
        let me = LocalStore.getData('me')
        toUpload.washingStation.push({ts: data.ts, id, farm: me.farm})
        LocalStore.addData('toUpload',toUpload)
        let _data = ID.decodeWashingStationID(id)
        console.log(_data)
        props.setPage('dashboard')
        
    }

    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center mb-3"><Shed /> <div class="inline align-middle ml-2">Washing Station</div></div>
        {status===0 && 
            <>
                <Weight setWeight={setWeight} value={weight} label='Insert collection bin weight:'/>
                <div class="mx-auto text-center font-medium mt-2"><button onClick={setWeightData} disabled={!weight || weight.toString()===''} class={(!weight || weight.toString()==='')?'text-slate-400':''}>Next <ArrowRightIcon/></button></div>
            </>
        }
        {status===1 &&
            <>
                <div class="text-center align-middle mb-2 font-medium"><QRIcon/> <div class="inline align-middle">Please scan the tractor bin</div> <TractorIcon/></div>
                <QR result={tractorBinIDResult} />
            </>
        }
        {status===2 &&
            <>
                <div class="text-center align-middle mb-2 font-medium"><QRIcon/> <div class="inline align-middle">Please scan the washing station bin</div> <Bin/></div>
                <QR result={washingStationBinIDResult} />
            </>
        }
        {status===3 && 
                <WashingStationSummary {...data} save={save}/>
            }
        
        </>
    )
}

export default WashingStation

