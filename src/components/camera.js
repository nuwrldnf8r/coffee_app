import React, { useState, useRef, useEffect } from "react"
import {CameraIcon, SaveIcon, RefreshIcon} from '../icons/icons.js'
import Spinner from '../components/spinner.js'

//const wait = (tm) => new Promise(r=>setTimeout(()=>{r()},tm))

const CameraComponent = (props) => {
    const [status, setStatus] = useState(1)
    const [imageSrc, setImage] = useState(null)
    const [showSpinner, setShowSpinner] = useState(true)
   
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(()=>{
        if(status===1){
            startCamera()
        } else if (status===2){
            stopCamera()
        }
        
    },[status])


    const startCamera = () => {
        setShowSpinner(true)
        navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} }).then(stream=>{
            setShowSpinner(false)
            try{
                if (videoRef.current) {     
                    videoRef.current.srcObject = stream
                } 
            } catch (e) {
                alert('Camera is not available')
            }
        })
    }

    const takePhoto = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        if (video && canvas) {
            
            const context = canvas.getContext('2d')
            canvas.height = video.videoHeight
            canvas.width = video.videoWidth
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            stopCamera()
            const imageDataUrl = canvas.toDataURL('image/png')
            //console.log(imageDataUrl)
            setImage(imageDataUrl)
            setStatus(2)
            
            
        }

    }

    const stopCamera = () => {
        let stream = videoRef.current.srcObject
        if (stream) {
            console.log('stopping camera')
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
    }

    const save = () => {
        //setStatus(1)
        //stopCamera()
        //console.log(imageSrc)
        props.saveImage(imageSrc)
    }

    return (
        <>
        <div class="container box-border mb-2 mt-3 w-full wx-auto max-w-md text-center p-2">
            <video ref={videoRef}  autoPlay class={status===1?"w-full":"hidden"}></video>
            <canvas ref={canvasRef} class="hidden" ></canvas>
            <img src={imageSrc} alt="Capture" width="640" height="480" class={status===2?"mx-auto":"hidden"}/>
        </div>
        
        {status===1 && 
            <div class="container mx-auto text-center font-medium"><button onClick={takePhoto}><CameraIcon /></button></div>
        }
        {status===2 && 
            <div class="container mx-auto text-center font-medium">
                <button class={imageSrc?"w-20 align-middle mx-3":"w-20 align-middle mx-3 text-slate-400"} onClick={save}  disabled={!imageSrc}><SaveIcon/> Save</button>
                <button class="w-20 align-middle mx-3" onClick={()=>{setStatus(1);startCamera()}}><RefreshIcon/> Redo</button>
            </div>
        }
        {showSpinner && 
            <div style={{position: 'absolute', width: '100%', top: 100, textAlign: 'center'}}><Spinner /></div>
        }
        </>
    )
}

export default CameraComponent