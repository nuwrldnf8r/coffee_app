import React, {useState} from 'react'
import Avatar from '../components/avatar'
import JobSelect from '../components/job_select'
import Button from '../components/button'
import { ArrowRightIcon } from '../icons/icons'

const SignUp = props => {
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [job, setJob] = useState('')

    const imageSelect = (img) => {
        setImage(img)
    }

    const next = () => {
        console.log(name, job)
    }

    return (
        <>
        <div class='container w-20 h-20 mx-auto mt-10'><Avatar size={'md'} image={image} edit onImageSelect={imageSelect}/></div>
        <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Click to upload your Avatar</p>
        
        <div class="p-5">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
            <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" onChange={e=>setName(e.target.value)}/>
        </div>
        
        <div class="px-5 mb-3"><JobSelect onSelect={j=>setJob(j)}/></div>
        <div class="text-center"><Button onClick={next} disabled={(job==='' || name==='')}><div class="inline align-middle">Next</div> <ArrowRightIcon/></Button></div>

        </>
    )
}

export default SignUp