import React, { useState, useRef, useEffect } from "react"
import {CameraIcon, SaveIcon, RefreshIcon} from '../icons/icons.js'
import Spinner from '../components/spinner.js'

const wait = (tm) => new Promise(r=>setTimeout(()=>{r()},tm))

const CameraComponent = (props) => {
    const [status, setStatus] = useState(1)
    const [imageSrc, setImage] = useState("")
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
            stopCamera(video.srcObject)
            const imageDataUrl = canvas.toDataURL('image/png')
            setImage(imageDataUrl)
            setStatus(2)
            
            
        }

    }

    const stopCamera = (stream) => {
        if (stream) {
            console.log('stopping camera')
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
    }

    const save = () => {
        setStatus(1)
        props.saveImage(imageSrc)
    }

    return (
        <>
        <div class="container box-border mx-10 mb-5 mt-10 w-fit">
            <video ref={videoRef} width="640" height="480" autoPlay class={status===1?"mx-auto":"hidden"}></video>
            <canvas ref={canvasRef}  width="640" height="480" class="hidden" ></canvas>
            <img src={imageSrc} width="640" height="480" class={status===2?"mx-auto":"hidden"}/>
        </div>
        
        {status===1 && 
            <div class="container mx-auto text-center"><button onClick={takePhoto}><CameraIcon /></button></div>
        }
        {status===2 && 
            <div class="container mx-auto text-center">
                <button class="w-20 align-middle mx-3" onClick={save}><SaveIcon/> Save</button>
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