import React, {useState} from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner'

export const QR = (props)=> {
    const [stopScanning, setStopScanning] = useState(false)
    const sendResult = (result) => {
        const quit = props.result(result)
        if(!quit) return
        setStopScanning(true)
    }
    return <QrScanner scanDelay={1000} onDecode={sendResult} onError={e=>console.log(e)} stopScanning={stopScanning}/>
}

