import React, { useState, useEffect} from 'react'
import { LocalStore } from '../lib/storage'

const Harvester = props => {
    const [people, setPeople] = useState([])

    const liAr = people.map(p=><option value={p.id} key={p.id}>{p.name}</option>)
    
    useEffect(()=>{
        let _people = LocalStore.getData('people')
        _people = _people.filter(p=>Object.keys(p.role)[0]==='Harvester')
        setPeople(_people)
    },[setPeople])

    return (
        <>
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Harvester:</label>
            <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e=>props.onSelect(e.target.value)}>
            {liAr}
            </select>
        </>
    )
}

export default Harvester
