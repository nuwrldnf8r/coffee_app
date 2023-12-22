import React, {useState} from 'react'
import Avatar from '../components/avatar'

const SignUp = props => {
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const imageSelect = (img) => {
        setImage(img)
    }
    return (
        <>
        <div class='container w-20 h-20 mx-auto mt-10'><Avatar size={'md'} image={image} edit onImageSelect={imageSelect}/></div>
        <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Click to upload your Avatar</p>
        
        <div class="mb-5 p-5">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
            <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" onChange={e=>setName(e.target.value)}/>
        </div>
        </>
    )
}

export default SignUp