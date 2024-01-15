import React from 'react';
import { useState, useEffect} from 'react'
import {TractorIcon, BackIcon} from '../icons/icons'

const CollectionPoint = (props) => {
    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><TractorIcon /> <div class="inline align-middle ml-2">Collection Point</div></div>
    
        </>
    )
}

export default CollectionPoint