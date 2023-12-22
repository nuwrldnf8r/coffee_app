import React, {useState, useRef, createRef, useEffect} from 'react'

const OTP = (props) => {
    const [otp, setOTP] = useState('')
    const inputStyle="flex-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-1 text-center"
    const inputRefs = useRef(Array(props.length).fill(null).map(() => createRef()))
    const inputs = Array(props.length).fill(null).map((_,index)=>(
        <input type="number" key={'input' + index} class={inputStyle} ref={inputRefs.current[index]}
            onChange={e=>inputChange(index,e.target.value)}
        />
    ))

    useEffect(()=>{
        if(otp===''){
            console.log('set focus')
            inputRefs.current[0].current.focus()
        }
    })

    const inputChange = (index, value) => {
        if(index===props.length-1){
            props.onComplete(otp + value)
        } else {
            setOTP(otp + value)
            inputRefs.current[index + 1].current.focus()
        }
    }

    return (
        <div class="container text-center max-w-sm mx-auto p-5">
        <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OTP</label>
        <div class="flex">
           {inputs}
        </div>
        <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter OTP</p>
        </div>
    )
}

export default OTP