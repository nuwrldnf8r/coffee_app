import React, {useState, useEffect} from 'react'
//import {getAll, set} from '../lib/farm_info'
import {addFarm} from '../lib/farminfo'
import Button from '../components/button'
//import { ArrowRightIcon } from '../icons/icons'
import {ID, base64ToHex} from '../lib/storage'

const FarmInfo = (props) => {
    const [loading, setLoading] = useState(false)
    const [farm, setFarm] = useState(null)
    const [coordinates, setCoordinates] = useState(null)
    //const [farms, setFarms] = useState(null)
    //const [error, setError] = useState(null)
    
    /*
    useEffect(()=>{
        if(farms){
            setLoading(true)
            getAll(props.mobile).then(farm=>{
                setFarm(farm)
                setLoading(false)
                
            })
        }
    },[farms, props.mobile])*/

    useEffect(() => {
        if(!coordinates){
          // Check if the browser supports geolocation
          if (navigator.geolocation) {
            // Get the user's current position
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;      
                setCoordinates({latitude, longitude})
              },
              (error) => {
                console.error('Error getting user location:', error.message);
              }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        }
    })


    const setFarmName = async() => {
        setLoading(true)
        try{
            if(coordinates){
                const base64ID = ID.farmID(coordinates)
                console.log('base64 ID: ' + base64ID)
                const id = base64ToHex(base64ID)
                console.log('id to hex: ' + id)
                
                await addFarm(props.mobile,id,farm,'_test_')
                await props.complete(farm)
                setLoading(false)
                
            }
        } catch(e){
            //TODO: catch for farm already exists etc.
            console.log(e)
        }
        
    }

    const setLong = (lng) => {
        let coords = Object.assign({},coordinates)
        coords.longitude = lng
        setCoordinates(coords)
    }

    const setLat = (lat) => {
        let coords = Object.assign({},coordinates)
        coords.latitude = lat
        setCoordinates(coords)
    }

    /*
    {error && 
        <div class="text-red-700 text-center">{error}</div>
    }
    */

    return (
        <>
            {props.AddFarm && 
                <div class="container p-5">
                    <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Please enter the name of your Farm</p>
                    <label class="block mb-2 mt-3 text-sm font-medium text-gray-900 dark:text-white">Farm Name</label>
                    <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Farm Name" onChange={e=>setFarm(e.target.value)}/>
                    {coordinates && 
                        <div className="w-50 mt-5 block">
                            <div>
                            <label className="w-20 inline-block mb-2 mt-3 text-sm font-medium text-gray-900 dark:text-white">Longitude</label>
                            <input type="text" style={{width: 110}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Longitude" onChange={e=>setLong(e.target.value)} value={coordinates.longitude}/>
                            </div>
                            <div>
                            <label className="w-20 inline-block mb-2 mt-3 text-sm font-medium text-gray-900 dark:text-white">Latitude</label>
                            <input style={{width: 110}} type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Farm Name" onChange={e=>setLat(e.target.value)} value={coordinates.latitude}/>
                            </div>
                        </div>
                    }
                    
                    <div class="text-center mt-5">
                        
                        <Button onClick={setFarmName} disabled={(!farm)}>
                            {loading && 
                                    <svg aria-hidden="true" class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>

                                    </svg>
                            }
                            <div class="inline align-middle">
                            Create Profile</div> </Button></div>
                </div>
            }
        </>
    )
}

export default FarmInfo