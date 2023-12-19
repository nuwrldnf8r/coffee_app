import React from 'react'
import {useState, useEffect} from 'react'

const Weight = (props) => {
    const [weight,setWeight] = useState()
    useEffect(()=>{
        setWeight(props.value)
    },[props.value])
    return (
        <>
            <div class="text-xs text-center mb-1 mt-4">Weight</div>
            <div class="text-center mb-5"><input type='number' class="rounded-full pl-7" onChange={e => props.setWeight(e.target.value)} value={weight}/></div>
        </>
        
    )
}

export default Weight