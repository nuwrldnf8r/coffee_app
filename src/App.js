import React from 'react';
import { useState, useEffect} from 'react'
//import InField from './pages/infield_collection'
import PeopleManagement from './pages/people_management.js'
import Register from './pages/register'
import Splash from './pages/splash'
import SignUp from './pages/signup'
import Dashboard from './pages/dashboard'
import {getPrincipal, get, set} from'./lib/data'
import { LocalStore } from './lib/storage'
import {add as _add, get as _get} from './lib/ipfs'
import {getID} from './lib/id'
import {addFarm, getFarm, getFarms, updateWorker, getWorkers, getWorker, id, getFarmFromWorkerId} from './lib/farminfo'

window.getPrincipal = getPrincipal
window.data = {get, set}
window.ipfs = {add: _add, get: _get}
window.getID = getID
window.addFarm = addFarm
window.getFarm = getFarm
window.getFarms = getFarms
window.id = id
window.updateWorker = updateWorker
window.getWorkers = getWorkers
window.getWorker = getWorker


//https://github.com/tailwindlabs/tailwindcss-forms
//https://tailwindcss.com/docs/margin

/*

<div class="container mx-auto text-center mt-10">
  <div class="flex flex-row content-center h-7">
    <div class="basis-1/4 align-middle">Number</div>
    <input type="number" class="rounded-lg basis-1/2"/>
  </div>
</div>
*/

/*
  <PeopleManagement/>
  <InField /> 
  <Register/>
*/

const AppStatus = {startup: 0, initializing: 1, initialized: 2}

function App() {
  const [status, setStatus] = useState(AppStatus.startup)
  const [page, setPage] = useState('splash')
  const [user, setUser] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(()=>{
    if(status===AppStatus.startup){
      setStatus(AppStatus.initializing)
      let me = LocalStore.getData('me')
      if(me){
        setUser(me)
        console.log(me)
        setPage('dashboard')
      } else {
        setTimeout(()=>setPage('register'),1000)
      }
      
      
    }
  },[status])

  const signUp = (mobile) => {
    setPage('signup#' + mobile)
  }

  const logIn = async (mobile) => {
    if(loggingIn) return
    setLoggingIn(true)
    let _id = await id(mobile)
    let farm = await getFarmFromWorkerId(mobile, id)
    if(!farm) signUp()
    //setPage('login#' + mobile)
  }

  const signupComplete = () => {
    setPage('dashboard')
  }

  return (
    <>
    <div class="text-center text-sm text-gray-300 dark:text-gray-400, m-1" style={{position: 'absolute', right: 0, top: 0}}>v0.008</div>
      {page==='splash' && 
        <Splash/>
      }
      {page==='register' && 
        <Register signUp={signUp} logIn={logIn} loggingIn={loggingIn}/>
      }
      {page.split('#')[0]==='signup' &&
        <SignUp mobile={page.split('#')[1]} complete={signupComplete}/>
      }
      {page.split('#')[0]==='login' &&
        <div>Login  {page.split('#')[1]}</div>
      }
      {page==='dashboard' && 
        <Dashboard setPage={setPage}/>
      }
      {page==='people' && 
        <PeopleManagement setPage={setPage} me={user}/>
      }
      
    </>
    
  );
}

export default App;
