import React from 'react'
import splash from '../images/splash.png'

const Splash = () => {
    return (
        <>
        <img src={splash} alt='splash' height='200' width='200' class="m-auto mt-40" />
        <div class="text-center text-xs text-gray-500">loading..</div>
        </>
    )
}

export default Splash