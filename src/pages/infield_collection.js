import React from 'react';
import { useState, useEffect} from 'react'
import CameraComponent  from '../components/camera'
import Weight from '../components/weight'
import InfieldSummary from '../components/infield_summary'
import {ArrowRightIcon, CameraIcon, QRIcon, BucketIcon, BackIcon} from '../icons/icons'
import {LocalStore} from '../lib/storage'
import {QR} from '../components/qr'
import Harvester from '../components/harvester_info'

const InField = (props) => {
    const [status, setStatus] = useState(0)
    const [weight, setWeight] = useState()
    const [data, setData] = useState({weight: 0, coordinates: null, image: null, ts: 0, bucketID: null, harvester: null})
    
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
        setStatus(2)
      }

      const setImageData = (imgData) => {
        console.log('here')
        if(data.image) return
        let _data = Object.assign({},data)
        _data.image = imgData
        _data.ts = Date.now()
        setData(_data)
        console.log(_data.image)
        setStatus(4)
      }

      const qrResult = (result) => {
        if(data.bucketID) return true
        if(result.substr(0,4)!=='bkt:') return false
        result = parseInt(result.substring(4))
        console.log('result: ' + result)
        let _data = Object.assign({},data)
        _data.bucketID = result
        setData(_data)
        setStatus(3)
        return true
      }

      const harvesterSelect = id => {
        let _data = Object.assign({},data)
        _data.harvester = id
        setData(_data)
      }

      const save = async () => {
        /*
        let collected = LocalStore.addCollectedData(data)
        console.log(collected.id())
        */
      }

      return (
        <>  
           <div class="ml-2 mt-2">
              <button onClick={() => props.setPage('dashboard')}>
                  <BackIcon />
              </button>
          </div>
          <div class="text-center"><BucketIcon /> <div class="inline align-middle ml-2">In-Field Collection</div></div>
            {status===0 && 
                <>
                  
                  <div class="mx-auto mt-7 px-5"><Harvester onSelect={harvesterSelect}/></div>
                  <div class="mx-auto text-center font-medium mt-5"><button onClick={()=>{
                    if(!data.harvester){
                      let _people = LocalStore.getData('people')
                      _people = _people.filter(p=>Object.keys(p.role)[0]==='Harvester')
                      harvesterSelect(_people[0].id)
                    }
                    setStatus(1)
                  }}>Next <ArrowRightIcon/></button></div>
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
                <InfieldSummary {...data} save={save}/>
            }
            
        </>
      )
}

export default InField

