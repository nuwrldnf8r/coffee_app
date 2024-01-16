import React from 'react';
//import { useState, useEffect} from 'react'
import {Shed, BackIcon} from '../icons/icons'

const WashingStation = (props) => {
    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><Shed /> <div class="inline align-middle ml-2">Washing Station</div></div>
    
        </>
    )
}

export default WashingStation