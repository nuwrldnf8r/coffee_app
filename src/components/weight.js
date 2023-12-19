import React from 'react'
import {useState, useEffect} from 'react'

const Weight = (props) => {
    const [weight,setWeight] = useState()
    useEffect(()=>{
        setWeight(props.value)
    },[props.value])
    return (
        <div class="flex flex-row max-w-xs m-5 mx-auto">
            <div class="basis-1/3 p-2 ">Weight</div>
            <div class="basis-2/3 "><input type='number' class="rounded-full pl-7" onChange={e => props.setWeight(e.target.value)} value={weight}/></div>
        </div>
        
    )
}

export default Weight