import React from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner'

export const QR = (props)=> {
    return <QrScanner onDecode={(result=>console.log(result))} onError={e=>console.log(e)} />
}

