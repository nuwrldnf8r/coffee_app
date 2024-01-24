import React, {useState, useEffect, useCallback} from 'react'
import { BackIcon, DataIcon, BucketIcon, TractorIcon, Shed, QRIcon } from '../icons/icons'
import { LocalStore, ID } from '../lib/storage'
import {QR} from '../components/qr'
import {Spinner, UploadIcon} from '../icons/icons'
import {addData, getDataByFarm} from '../lib/farminfo'  //getDataByFarm,
import {add} from '../lib/ipfs'
import DataInfo from '../components/data_display'
const Data = (props) => {
    const [selected, setSelected] = useState(0)
    const [data, setData] = useState(null)
    const [dataToScan, setDataToScan] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState([])
    const [uploadedData, setUploaded] = useState(null)

    const getUploadedData = async(uploadnew) => {
        
        let data = LocalStore.getData('data')
        if(!data || uploadnew){
            setLoading(true)
            let me = LocalStore.getData('me')
            data = await getDataByFarm(me.mobile,me.farm,0,Date.now())
            setLoading(false)
        }
        setUploaded(data)
        return data
    }

    const upload = async (_data) => {
        /*
        {ts: 1705589004916, id: 'YwABjR0G2nQAAAoAAHsSAxsRDgYUCggBDw0bHQ', harvester: 't4vdv-yzxzx-kv5kx-4o3ys-4exyv-dcauv-7sqtf-ylh7z-cizsi-trrjt-iqe', farm: 'Farm1', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAA…LzU2+Fn7y7lEMkzew+H8BI7m5gXHhR5oAAAAASUVORK5CYII='}
        */
        let me = LocalStore.getData('me')
        let _uploading = uploading.slice()
        _uploading.push(_data.id)
        setUploading(_uploading)
        let metadata = {}
        metadata.harvester = _data.harvester
        if(_data.image){
            console.log('uploading image')
            metadata.imageCID = await add(_data.image)
            console.log(metadata.imageCID)
        }
        console.log('uploading...')
        await addData(me.mobile,_data.id,_data.ts,me.farm,JSON.stringify(metadata))
        //await getUploadedData(true)
        let localData = LocalStore.getData('data')
        localData.push(_data)
        LocalStore.addData('data',localData)
        _uploading = uploading.slice().filter(id=>id!==_data.id)
        setUploading(_uploading)
        select(selected)
    }

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
    
    const sortLoadedData = () => {
        let me = LocalStore.getData('me')
        let _data = LocalStore.getData('data')
        let sorted = {}
        if(!_data) return sorted
        console.log(_data)
        _data.forEach(itm=>{
            let parsed = ID.decode(itm.id)
            let _type = (parsed.type==='c')?'infieldCollection':
                (parsed.type==='C')?'collectionPoint':'washingStation'
            if(!sorted[_type])sorted[_type] = []
            delete itm.farm_id
            itm.farm = me.farm
            itm.uploaded = true
            sorted[_type].push(itm)
        })
        return sorted
    }

    const select = useCallback((selection) => {
        setDataToScan(null)
        setSelected(selection)
        let _data = sortLoadedData()
        console.log(_data)
        let toUpload = LocalStore.getData('toUpload')
        for(let _type in toUpload){
            toUpload[_type].forEach(itm=>{
                if(!_data[_type])_data[_type] = []
                if(!_data[_type].find(_itm=>_itm.id===itm.id)){
                    itm.uploaded = false
                    _data[_type].push(itm)
                }                
            })
        }
        //console.log(_data)
        if(selection===0 && _data){
            if(_data.infieldCollection){
                let ar = _data.infieldCollection.sort((a,b)=>a.ts>b.ts)
                console.log(ar)
                
                setData(ar)
                    
            } else {
                setData(null)
            }
        } else if(selection===1 && _data){
            if(_data.collectionPoint){
                let ar = _data.collectionPoint.sort((a,b)=>a.ts>b.ts)
                
                setData(ar)
            } else {
                setData(null)
            }
        } else if(selection===2 && _data){
            if(_data.washingStation){
                let ar = _data.washingStation.sort((a,b)=>a.ts>b.ts)
                
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

    useEffect(()=>{
        console.log('loading data')
        //console.log(selected)
        if(!uploadedData && !loading){
            setLoading(true)
            getUploadedData().then(data=>{
                if(typeof(data)==='object'){
                    setUploaded(data)
                } else {
                    setUploaded([])
                }
                setLoading(false)
                //select(selected)
                console.log(data)
            })
        }
    }, [setLoading, loading, select, selected, uploadedData])

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
                                <tr>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bucket</th>
                                <th  class="bg-gray-200"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && 
                                    <>
                                        {data.map(itm=>{
                                        const info = ID.decodeInfieldCollectionID(itm.id)
                                        console.log(info)
                                        return (
                                            <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                                                <td class="px-3 py-2">{formatTimestamp(info.ts)}</td>
                                                <td class="px-3 py-2">{info.bucketID}</td>
                                                <td>
                                                    {loading && 
                                                        <Spinner w={4} h={4} />
                                                    }
                                                    {(!loading && !itm.uploaded && uploading.indexOf(itm.id)===-1) && 
                                                        <button onClick={(e)=>{upload(itm);e.stopPropagation()}}><UploadIcon w={4} h={4} /></button>
                                                    }
                                                    {uploading.indexOf(itm.id)>-1 && 
                                                        <div class="text-green-400"><Spinner w={4} h={4} /></div>
                                                    }
                                                </td>
                                            </tr>
                                        )

                                    })}
                                    </>
                                }
                            </tbody>
                        </table>
                    }
                    {selected===1 && 
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bucket</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bin</th>
                                <th  class="bg-gray-200"></th>
                                </tr>
                            </thead>
                            <tbody>{data && 
                                <>
                                {data.map(itm=>{
                                const info = ID.decodeCollectionPointID(itm.id)
                                    return (
                                        <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                                            <td class="px-3 py-2">{formatTimestamp(info.ts)}</td>
                                            <td class="px-3 py-2">{info.bucketID}</td>
                                            <td class="px-3 py-2">{info.binID}</td>
                                            <td>
                                                {loading && 
                                                    <Spinner w={4} h={4} />
                                                }
                                                {(!loading && !itm.uploaded && uploading.indexOf(itm.id)===-1) && 
                                                    <button onClick={(e)=>{upload(itm);e.stopPropagation()}}><UploadIcon w={4} h={4} /></button>
                                                }
                                                {uploading.indexOf(itm.id)>-1 && 
                                                    <div class="text-green-400"><Spinner w={4} h={4} /></div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                                </>
                            }</tbody>
                        </table>
                    }
                    {selected===2 && 
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                <th class="text-left px-3 py-1 bg-gray-200">Timestamp</th>
                                <th class="text-left px-3 py-1 bg-gray-200">Bin</th>
                                <th class="text-left px-3 py-1 bg-gray-200">WS Bin</th>
                                <th  class="bg-gray-200"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data &&
                                    <>
                                    {data.map(itm=>{
                                    const info = ID.decodeWashingStationID(itm.id)
                                    return (
                                        <tr key={itm.id} onClick={()=>dataSelected(itm.id)}>
                                            <td >{formatTimestamp(info.ts)}</td>
                                            <td class="px-3 py-2">{info.binID}</td>
                                            <td class="px-3 py-2">{info.wsBinID}</td>
                                            <td>
                                                {loading && 
                                                    <Spinner w={4} h={4} />
                                                }
                                                {(!loading && !itm.uploaded && uploading.indexOf(itm.id)===-1) && 
                                                    <button onClick={(e)=>{upload(itm);e.stopPropagation()}}><UploadIcon w={4} h={4} /></button>
                                                }
                                                {uploading.indexOf(itm.id)>-1 && 
                                                    <div class="text-green-400"><Spinner w={4} h={4} /></div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                    })}
                                    </>
                                }
                                
                            </tbody>
                        </table>
                    }
                    </>
                }
                
                {dataToScan && 
                    <DataInfo id={dataToScan} data={data} back={()=>setDataToScan(null)} />
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