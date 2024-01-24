import React from 'react'
import {ID} from '../lib/storage'
import QRCode from 'react-qr-code'
import { BackIcon} from '../icons/icons'

const DataInfo = props => {
    let itm = props.data.find(_itm=>_itm.id===props.id)
    const decoded = ID.decode(props.id)
    console.log(decoded)
    const _type = (decoded.type==='c')?'infieldCollection':
                (decoded.type==='C')?'collectionPoint':'washingStation'
    itm.weight = decoded.data.weight
    itm.coordinates = decoded.data.coordinates
    itm.bucketID = decoded.data.bucketID
    itm.binID = decoded.data.binID
    itm.wsBinID = decoded.data.wsBinID

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    
    return (
        <>
            {_type==='infieldCollection' && 
                <>
                    <div>Date: {formatTimestamp(itm.ts)}</div>
                    <div>Bucket: 
                        <div>
                            <div class="ml-2 inline">ID: {itm.bucketID}</div>
                            <div class="ml-2 inline">Weight: {itm.weight}</div>
                        </div>
                    </div>
                    <div class="mx-auto my-5" style={{width: 150}}><QRCode value={itm.id} size={150} viewBox={`0 0 150 150`}/></div>
                    <div class="text-center m-4"><button onClick={props.back}><BackIcon /> Back</button></div>
                </>
            }
            {_type==='collectionPoint' && 
                 <>
                  <div>Date: {formatTimestamp(itm.ts)}</div>
                    <div>Bucket: 
                        <div>
                            <div class="ml-2 inline">ID: {itm.bucketID}</div>
                            <div class="ml-2 inline">Weight: {itm.weight}</div>
                        </div>
                    </div>
                    <div>Bin: 
                        <div>
                            <div class="ml-2 inline">ID: {itm.bucketID}</div>
                        </div>
                    </div>
                    <div class="mx-auto my-5" style={{width: 150}}><QRCode value={itm.id} size={150} viewBox={`0 0 150 150`}/></div>
                    <div class="text-center m-4"><button onClick={props.back}><BackIcon /> Back</button></div>
                </>
            }
            {_type==='washingStation' && 
                <>
                <div>Date: {formatTimestamp(itm.ts)}</div>
                  <div>Bin: 
                      <div>
                          <div class="ml-2 inline">ID: {itm.binID}</div>
                          <div class="ml-2 inline">Weight: {itm.weight}</div>
                      </div>
                  </div>
                  <div>WS Bin: 
                      <div>
                          <div class="ml-2 inline">ID: {itm.wsBinID}</div>
                      </div>
                  </div>
                  <div class="mx-auto my-5" style={{width: 150}}><QRCode value={itm.id} size={150} viewBox={`0 0 150 150`}/></div>
                  <div class="text-center m-4"><button onClick={props.back}><BackIcon /> Back</button></div>
              </>
            }
        </>
    )
}

export default DataInfo