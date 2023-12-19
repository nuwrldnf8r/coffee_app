import React, { useState, useEffect } from "react"
import {Store} from '../lib/storage'

const CollectionList = (props) => {
    const [collectedList, setCollectedList] = useState([])
    
    useEffect(()=>{
        const data = Store.getCollectedData()
        setCollectedList(data)
    })

    

    return (
        <>
            {collectedList.map(item=><div key={item.id}></div>)}
        </>
    )
    
}

export default CollectionList