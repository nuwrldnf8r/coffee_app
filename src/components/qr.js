import React, {useState} from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner'

export const QR = (props)=> {
    const [stopScanning, setStopScanning] = useState(false)
    return <QrScanner scanDelay={1000} onDecode={result=>{setStopScanning(true);props.result(result)}} onError={e=>console.log(e)} stopScanning={stopScanning}/>
}

