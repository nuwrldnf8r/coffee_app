import React from 'react'

const JobSelect = props => {
    const jobs = [
        'Farmer','Farm Manager','Field Manager','Factory Manager','Receiving Manager','Harvester'
    ]
    const liAr = jobs.map((j,i)=>(
        <option value={j} key={i}>{j}</option>
    ))

    return (
        <>
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">I am a..</label>
        <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e=>props.onSelect(e.target.value)}>
        {liAr}
        </select>
       
        </>
    )
}

export default JobSelect