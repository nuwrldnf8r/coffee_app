import React, {useState, useEffect, useCallback} from 'react'
import { BackIcon, DataIcon, BucketIcon, TractorIcon, Shed, QRIcon } from '../icons/icons'
import { LocalStore, ID } from '../lib/storage'
import QRCode from 'react-qr-code'
import {QR} from '../components/qr'

const Data = (props) => {
    const [selected, setSelected] = useState(0)
    const [data, setData] = useState(null)
    const [dataToScan, setDataToScan] = useState(null)

    const dataSelected = (id) => {
        setDataToScan(id)
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      }

    const unselectedClass = 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
    const selectedClass = 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
    
    const select = useCallback((selection) => {
        setSelected(selection)
        let _data = LocalStore.getData('toUpload')
        if(selection===0 && _data){
            if(_data.infieldCollection){
                let ar = _data.infieldCollection.sort((a,b)=>a.ts>b.ts).map(itm=>{
                    const info = ID.decodeInfieldCollectionID(itm.id)
                    console.log(info)
                    return (
                        <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                            <td class="px-3 py-2">{formatTimestamp(info.ts)}</td>
                            <td class="px-3 py-2">{info.bucketID}</td>
                        </tr>
                    )
                })
                
                setData(ar)
                    
            } else {
                setData(null)
            }
        } else if(selection===1 && _data){
            if(_data.collectionPoint){
                let ar = _data.collectionPoint.sort((a,b)=>a.ts>b.ts).map(itm=>{
                    const info = ID.decodeCollectionPointID(itm.id)
                    return (
                        <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                            <td class="px-3 py-2">{formatTimestamp(info.ts)}</td>
                            <td class="px-3 py-2">{info.bucketID}</td>
                            <td class="px-3 py-2">{info.binID}</td>
                        </tr>
                    )
                })
                setData(ar)
            } else {
                setData(null)
            }
        } else if(selection===2 && _data){
            if(_data.washingStation){
                let ar = _data.washingStation.sort((a,b)=>a.ts>b.ts).map(itm=>{
                    const info = ID.decodeWashingStationID(itm.id)
                    return (
                        <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                            <td >{formatTimestamp(info.ts)}</td>
                            <td class="px-3 py-2">{info.binID}</td>
                            <td class="px-3 py-2">{info.wsBinID}</td>
                        </tr>
                    )
                })
                setData(ar)
            } else {
                setData(null)
            }
        } else {
            setData(null)
        }
    },[])

    useEffect(()=>{
        if(!data && selected!==3){
            select(selected)
        }
        
    },[selected, select, data])

    const qrResult = (result) => {
        let decoded = ID.decode(result)
        console.log(decoded)
        
        if(decoded.type==='none') return false
        let me = LocalStore.getData('me')
        let toUpload = LocalStore.getData('toUpload')
        toUpload = toUpload || {}
        if(decoded.type==='c'){
            if(!toUpload.infieldCollection)toUpload.infieldCollection = []
            if(!toUpload.infieldCollection.find(itm=>itm.id===decoded.id)){
                console.log('here')
                toUpload.infieldCollection.push({ts:decoded.data.ts, id: decoded.id, farm: me.farm})
                //console.log(toUpload)
                LocalStore.addData('toUpload',toUpload)
                select(0)
            }
        } else if(decoded.type==='C'){
            if(!toUpload.collectionPoint)toUpload.collectionPoint = []
            if(!toUpload.collectionPoint.find(itm=>itm.id===decoded.id)){
                toUpload.collectionPoint.push({ts:decoded.data.ts, id: decoded.id, farm: me.farm})
                LocalStore.addData(toUpload)
                select(1)
            }
        } else if(decoded.type==='W'){
            if(!toUpload.washingStation)toUpload.washingStation = []
            if(!toUpload.washingStation.find(itm=>itm.id===decoded.id)){
                toUpload.washingStation.push({ts:decoded.data.ts, id: decoded.id, farm: me.farm})
                LocalStore.addData(toUpload)
                select(2)
            }
        }
        return true
        
    }

    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><DataIcon /> <div class="inline align-middle ml-2">Data</div></div>
        <div class="p-5">
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li class="me-2">
                    <button class={selected===0?selectedClass:unselectedClass} onClick={()=>select(0)}><BucketIcon /></button>
                </li>
                <li class="me-2">
                    <button  class={selected===1?selectedClass:unselectedClass} onClick={()=>select(1)}><TractorIcon /></button>
                </li>
                <li class="me-2">
                    <button class={selected===2?selectedClass:unselectedClass} onClick={()=>select(2)}><Shed /></button>
                </li>
                <li class="me-2 ml-10 order-last">
                    <button  class={selected===3?selectedClass:unselectedClass} onClick={()=>select(3)}><QRIcon /></button>
                </li>
            
            </ul>
        </div>

        <div class="text-sm mx-5">
            {selected!==3 && 
                <>
                {!dataToScan && 
                    <>
                    {selected===0 && 
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bucket</th>
                            </thead>
                            <tbody>{data}</tbody>
                        </table>
                    }
                    {selected===1 && 
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bucket</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bin</th>
                            </thead>
                            <tbody>{data}</tbody>
                        </table>
                    }
                    {selected===2 && 
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bin</th>
                                <th class="text-left px-3 py-1 bg-gray-200">WS Bin</th>
                            </thead>
                            <tbody>{data}</tbody>
                        </table>
                    }
                    </>
                }
                {dataToScan && 
                    <>
                    <div class="p-7"><QRCode value={dataToScan} /></div>
                    <div class="text-center m-4"><button onClick={()=>setDataToScan(null)}><BackIcon /> Back</button></div>
                    </>
                }
                </>
            }
            {selected===3 && 
                <div><QR result={qrResult} /></div>
            }
            
        </div>

        
        </>
    )
}

export default Data