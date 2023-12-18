import React, { useState, useRef, useEffect } from "react"

import {CameraIcon} from '../icons/icons.js'

const CameraComponent = (props) => {
    const [status, setStatus] = useState(1)
    const [imageSrc, setImage] = useState("")
   
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(()=>{
        if(status===1){
            try{
                navigator.mediaDevices.getUserMedia({ video: true }).then(stream=>{
                    if (videoRef.current) {     
                        videoRef.current.srcObject = stream
                    } 
                })
            } catch(e){
                console.log('Camera not available')
            }
        } else if (status===2){
            stopCamera()
        }
        
    },[status])




    const takePhoto = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        if (video && canvas) {
            const context = canvas.getContext('2d')
            canvas.height = video.videoHeight
            canvas.width = video.videoWidth
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageDataUrl = canvas.toDataURL('image/png')
            setImage(imageDataUrl)
            setStatus(2)
            
        }

    }

    const stopCamera = () => {
        const stream = videoRef.current.srcObject
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach(track => track.stop())
          videoRef.current.srcObject = null
        }
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
            <div class="container mx-auto text-center"><button></button></div>
        }
        </>
    )
}

export default CameraComponent