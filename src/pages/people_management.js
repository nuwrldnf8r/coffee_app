import React from 'react';
import { useState, useEffect} from 'react'
import {UsersIcon, BackIcon, AddPersonIcon} from '../icons/icons'

const PeopleManagement = (props) => {
    return (
        <>
        <div class="ml-2 mt-2">
            <button onClick={() => props.setPage('dashboard')}>
                <BackIcon />
            </button>
        </div>
        <div class="text-center"><UsersIcon /> <div class="inline align-middle ml-2">Manage People</div></div>
    
        </>
    )
}

export default PeopleManagement