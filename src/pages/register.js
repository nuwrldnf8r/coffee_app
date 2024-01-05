import React from 'react';
import { useState} from 'react'
import Button from '../components/button'
import OTP from '../components/otp'
import {SaveIcon} from '../icons/icons'

const Action = {signUp: 0, logIn: 1}
const Register = (props) => {
    const [mobile, setMobile] = useState('')
    const [status, setStatus] = useState(0) //main page: 0, waiting code
    const [action, setAction] = useState(Action.signUp)
    const [OTCCode, setOTCCode] = useState('')

    const validateMobile = () => {
        return ((mobile.substring(0,1)==='0' && mobile.length===10) || (mobile.substring(0,1)!=='0' && mobile.length===9) || (mobile.substring(0,2)!=='27' && mobile.length===11))
    }

    const getSignupCode = () => {
        //send for signup code
        setOTCCode('12345')
        setStatus(1)
        setAction(Action.signUp)
    }

    const getLoginCode = async () => {
        //send for login code
        setOTCCode('12345')
        setStatus(1)
        setAction(Action.logIn)
    }

    const receivedOTC = async (code) => {
        console.log('received ' + code)
        console.log('otc: ' + OTCCode)
        if(code!==OTCCode){
            console.log('oh dear')
            setStatus(0)
            return
        }
        if(action===Action.signUp){
            props.signUp(mobile)
        } else {
            props.logIn(mobile)
        }
    }

    return (
        <>
            <div class="text-center mt-10 mb-10 font-medium">{(action===Action.signUp)?'Sign up':'Log in'}</div>


            <form class="max-w-sm mx-auto p-4">
                <label for="phone-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile number:</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                        </svg>
                    </div>
                    <input type="number" id="phone-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="Mobile Number" value={mobile} onChange={e=>setMobile(e.target.value)}/>
                </div>
                <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter your mobile number</p>
            </form>

            {status===0 && 
                <>
                <div class="text-center mt-2"><Button disabled={!validateMobile()} onClick={getSignupCode}><SaveIcon/> <div class="align-middle inline">Sign up</div></Button></div>
                <div class="text-center mt-2 font-medium text-xs"><button disabled={!validateMobile()
                    } class={validateMobile()?'text-gray-600':'text-gray-300'} onClick={getLoginCode}>
                        or Log In
                        
                </button></div>
                </>
            }

            {status===1 && 
                <>
                    <OTP length={5} onComplete={receivedOTC} />
                </>
            }
            {props.loggingIn && 
                <div class="text-center mt-4">
                <svg aria-hidden="true" class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                Logging In..
                </div>
            }
        </>
    )
}

export default Register


//https://internetcomputer.org/docs/current/references/ii-spec