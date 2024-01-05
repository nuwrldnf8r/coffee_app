import React, {useState, useEffect} from 'react'
import {PersonCircledIcon, UsersIcon, BucketIcon, TractorIcon, Shed, DashboardIcon} from '../icons/icons' 

const Dashboard = props => {
    const [peopleLoading, setPeopleloading] = useState(false)
    const [people, setPeople] = useState(null)
    const [farm, setFarm] = useState(null)

    useEffect(()=>{
        if(!people){
            getPeople().then()
        }
    }, [people])

    const getPeople = async () => {
        if(peopleLoading) return
        setPeopleloading(true)
        if(!farm){
            if(props.me.farm){
                setFarm(props.me.farm)
            } else {
                
            }
        }
        setPeopleloading(true)
    }

    return (
        <>
            <div class="text-center mt-3"><DashboardIcon /> <div class="inline align-middle ml-2">Dashboard</div></div>
            <div class="grid grid-cols-2 text-center max-w-sm px-10 mx-auto mt-10">
                <div>
                    <button>
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
            <div class="grid grid-cols-3 text-center max-w-sm px-5 mx-auto mt-10">
                <div>
                    <button>
                    <BucketIcon />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">In-field collection</label>
                    </button>
                </div>
                <div>
                    <button>
                    <TractorIcon />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">Collection <br/>point</label>
                    </button>
                </div>
                <div>
                    <button>
                    <Shed />
                    <label class="block mb-2 mt-2 text-xs font-small text-gray-800 dark:text-white">Washing station</label>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Dashboard