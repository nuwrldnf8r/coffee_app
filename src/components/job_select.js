import React from 'react'

const JobSelect = props => {
    const jobs = [
        'Farmer','Farm Manager','Field Manager','Factory Manager','Receiving Manager','Harvester'
    ]
    const liAr = jobs.map((j,i)=>(
        <li  key={i} class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <div class="flex items-center ps-3">
                    <input id={j} type="radio" value={j} name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="Farmer" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{j}</label>
                </div>
        </li>
    ))

    return (
        <>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">I am a..</label>
        <ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e=>props.onSelect(e.target.value)}>
            {liAr}
        </ul>
        </>
    )
}

export default JobSelect