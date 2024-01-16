import React from 'react';
//import { useState, useEffect} from 'react'
import {PersonCircledIcon, BackIcon} from '../icons/icons'
import Button from '../components/button';

const MyInfo = (props) => {

    const signOut = () => {
       props.signOut()
    }

    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><PersonCircledIcon /> <div class="inline align-middle ml-2">My Info</div></div>
        <div class="mt-20 text-center">
            <Button onClick={signOut}>Sign Out</Button>
        </div>
        
        </>
    )
}

export default MyInfo