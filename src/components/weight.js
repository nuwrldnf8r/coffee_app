import React from 'react'
import {useState, useEffect} from 'react'

const Weight = (props) => {
    const [weight,setWeight] = useState()
    useEffect(()=>{
        setWeight(props.value)
    },[props.value])
    return (
        <>
            <form class="max-w-sm mx-auto p-4">
                <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Insert bucket weight:</label>
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Bucket weight" required  onChange={e => props.setWeight(e.target.value)} value={weight}/>
            </form>

        </>
        
    )
}

export default Weight