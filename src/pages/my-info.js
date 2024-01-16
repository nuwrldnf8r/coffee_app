import React from 'react';
//import { useState, useEffect} from 'react'
import {PersonCircledIcon, BackIcon} from '../icons/icons'

const MyInfo = (props) => {
    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><PersonCircledIcon /> <div class="inline align-middle ml-2">My Info</div></div>
    
        </>
    )
}

export default MyInfo