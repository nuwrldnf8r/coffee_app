import React from 'react';
import { useState} from 'react'
import {UsersIcon, BackIcon, AddPersonIcon} from '../icons/icons'
import AddPerson from '../components/add_person'

//import { LocalStore } from '../lib/storage'

const Person = (props) => {
    //console.log(`/.netlify/functions/image?cid=${props.image_cid}`)
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImageError] = useState(false)
    return (
        <div class="flex p-1 m-5 bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            {(!imgLoaded && imgError) &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-none w-8 h-8 bg-slate-400 rounded-full p-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            }
            {(!imgLoaded && !imgError) && 
            <div class="p-1">
            <svg aria-hidden="true" class="mr-2 w-6 h-6 rounded-full text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            </div>
            }
            <img src={`/.netlify/functions/image?cid=${props.image_cid}`} alt={props.name} class={`flex-none w-8 h-8 rounded-full border-gray-700 ${imgLoaded?'':'hidden'}`} onLoad={()=>setImgLoaded(true)} onError={()=>setImageError(true)}/>
            <div class="flex-1 ml-5">
                <div class="text-sm">{props.name}</div>
                <div class="ml-2 text-xs text-gray-700">{Object.keys(props.role)[0]}</div>
            </div>
        </div>    
    )
}

const PeopleManagement = (props) => {
    const [status, setStatus] = useState(0)
    const people = props.people.map(p=><Person key={p.id} {...p} />)

    const addPerson = async () => {
        setStatus(1)
    }

    const personAdded = (person) => {
        props.addPerson(person)
        setStatus(0)
    }

    return (
        <>
        {status===0 &&
            <>
            <div class="ml-2 mt-2">
                <button onClick={() => props.setPage('dashboard')}>
                    <BackIcon />
                </button>
            </div>
            <div class="text-center"><UsersIcon /> <div class="inline align-middle ml-2">Manage People</div></div>
            {(!props.people || props.people.length===0) && 
                <div class='text-center mt-10'>
                    <svg aria-hidden="true" class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                </div>
            }
            {props.people && props.people.length>0 && 
                <>
                <div>{people}</div>
                <div class="text-center"><button onClick={addPerson}><AddPersonIcon /></button></div>
                </>
            }
            </>
        }
        {status===1 && 
            <AddPerson farm={props.farm} personAdded={personAdded} back={()=>setStatus(0)}/>
        }
        </>
    )
}

export default PeopleManagement