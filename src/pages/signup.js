import React, {useState} from 'react'
import Avatar from '../components/avatar'
import JobSelect from '../components/job_select'
import Button from '../components/button'
import { ArrowRightIcon } from '../icons/icons'
import {add} from '../lib/ipfs'
import {getID} from '../lib/id'
import {updateWorker} from '../lib/farminfo'
//import {getPrincipal} from '../lib/user'
import FarmInfo from '../components/farm_info'
//import {addStaff} from '../lib/farm_info'

import {LocalStore} from '../lib/storage'

const Status = {profile: 0, farm_farmer: 1, farm_other: 2}

const SignUp = props => {
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [role, setRole] = useState('Farmer')
    const [status, setStatus] = useState(Status.profile)
    

    const imageSelect = (img) => {
        setImage(img)
    }

    const next = async () => {
        //let x = await add(image)
        if(role==='Farmer'){
            console.log('setting farmer')
            setStatus(Status.farm_farmer)
        } else {
            setStatus(Status.farm_other)
        }
    }

    const farmComplete = async (farm) => {
        console.log(farm)
        console.log('uploading image')
        let cid = 'null'
        if(image){
            cid = await add(image)
            console.log(cid)
        }
        console.log('get ID')
        let id = await getID(props.mobile)
        id = id.id
        console.log(id)
        console.log('creating user')
        console.log(role)
        await updateWorker(props.mobile, farm,name,id,role,cid)
        let user = {name, mobile: props.mobile, image}
        LocalStore.addData('me',user)
        props.complete()
    }

    return (
        <>
        {status===Status.profile && 
            <>
                <div class='container w-20 h-20 mx-auto mt-10'><Avatar size={'md'} image={image} edit onImageSelect={imageSelect}/></div>
                <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Click to upload your Avatar</p>
                
                <div class="p-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                    <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" onChange={e=>setName(e.target.value)}/>
                </div>
                
                <div class="px-5 mb-3"><JobSelect onSelect={j=>setRole(j)}/></div>
                <div class="text-center mt-5"><Button onClick={next} disabled={(role==='' || name==='')}><div class="inline align-middle">Next</div> <ArrowRightIcon/></Button></div>
            </>
        }  

        {status===Status.farm_farmer && 
            <>
                <FarmInfo mobile={props.mobile} AddFarm={true} complete={farmComplete}/>
            </>
        }
        {status===Status.farm_other && 
            <></>
        }
         
        </>
    )
}

export default SignUp