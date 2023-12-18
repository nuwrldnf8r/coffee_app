import React, { useState, useRef } from "react"


const CameraComponent = () => {
    const [isPreviewing, setPreviewing] = useState(false)
    const [displayPhoto, setDisplay] = useState('none')
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
  
    const startCamera = async () => {
      try {
        setPreviewing(true)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {     
            videoRef.current.srcObject = stream
            
        } 
      } catch (error) {
            console.error('Error accessing camera:', error)
      }
    }
  
    
    const stopCamera = () => {
      const stream = videoRef.current.srcObject
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
        videoRef.current.srcObject = null
        setPreviewing(false)
      }
    }
  
    const capturePhoto = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
  
      if (video && canvas) {
        console.log(video)
        const context = canvas.getContext('2d')
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        setDisplay('block')
        stopCamera()
      }
    }
    
  
    return (
      <div>
        {!isPreviewing && <button onClick={startCamera}>Start Camera</button>}
        {isPreviewing && (
          <div>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            <button onClick={capturePhoto}>Capture Photo</button>
          </div>
        )}
        {isPreviewing && <canvas ref={canvasRef} width="640" height="480" style={{display: displayPhoto}}></canvas> }
      </div>
    )
  
}

export default CameraComponent

