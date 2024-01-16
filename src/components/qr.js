import React, {useState} from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner'

export const QR = (props)=> {
    const [stopScanning, setStopScanning] = useState(false)
    const sendResult = (result) => {
        console.log(result)
        const quit = props.result(result)
        if(!quit) return
        setStopScanning(true)
    }
    return <div class="container box-border mb-2 mt-3 w-full wx-auto max-w-md text-center p-2">
        <QrScanner scanDelay={1000} onDecode={sendResult} onError={e=>console.log(e)} stopScanning={stopScanning}/>
        </div>
}

