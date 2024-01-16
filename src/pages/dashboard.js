import React, {useState, useEffect} from 'react'
import {PersonCircledIcon, UsersIcon, BucketIcon, TractorIcon, Shed, DashboardIcon} from '../icons/icons' 
import {getWorkers} from '../lib/farminfo'
import { LocalStore } from '../lib/storage'

const Dashboard = props => {
    const [peopleLoading, setPeopleloading] = useState(false)
    const [people, setPeople] = useState([])
    const [farm, setFarm] = useState(null)


    useEffect(()=>{
        if(people.length===0){
            console.log('loading people')
            getPeople().then()
        }
    })

    const getPeople = async () => {
        //check if online
        if(peopleLoading) return
        setPeopleloading(true)
        if(!farm){
            console.log(props.me)
            if(props.me.farm){
                setFarm(props.me.farm)
            } else {
                console.log("error - can't find farm")
                return
            }
        }
        if(people.length===0){
            console.log('getting workers')
            let _people = LocalStore.getData('people')
            console.log('**************************')
            console.log(_people)
            setPeople(_people)
            props.setPeople(_people)
            let workers = await getWorkers(props.me.mobile,props.me.farm)
            console.log(workers) 
            LocalStore.addData('people',workers)
            workers = workers.map(w=>{
                if(w.id===props.me.id) w.me=true
                return w
            })
            setPeople(workers)
            props.setPeople(workers)
        }
        setPeopleloading(false)
        
    }

    

    return (
        <>
            <div class="text-center mt-3"><DashboardIcon /> <div class="inline align-middle ml-2">Dashboard</div></div>
            <div class="grid grid-cols-2 text-center max-w-sm px-10 mx-auto mt-20">
                <div>
                    <button onClick={()=>props.setPage('my_info')}>
                    <PersonCircledIcon />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">My information</label>
                    </button>
                </div>
                <div>
                    <button onClick={()=>props.setPage('people')}>
                    <UsersIcon />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">Manage people</label>
                    </button>
                </div>
                <div></div>
            </div>
            <div class="grid grid-cols-2 text-center max-w-sm px-10 mx-auto mt-12">
                <div>
                    <button onClick={()=>props.setPage('infield_collection')} disabled={people.filter(p=>Object.keys(p.role)[0]==='Harvester').length===0}>
                    <BucketIcon disabled={people.filter(p=>Object.keys(p.role)[0]==='Harvester').length===0}/>
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">In-field collection</label>
                    </button>
                </div>
                <div>
                    <button onClick={()=>props.setPage('collection_point')}>
                    <TractorIcon />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">Collection <br/>point</label>
                    </button>
                </div>
                
            </div>
            <div class="text-center  mt-12">
                <div>
                    <button onClick={()=>props.setPage('washing_station')}>
                    <Shed />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">Washing station</label>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Dashboard